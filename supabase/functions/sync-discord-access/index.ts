import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type DiscordIdentity = {
  provider_id?: string;
  id?: string;
  sub?: string;
  username?: string;
  global_name?: string;
  avatar_url?: string;
};

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const discordBotToken = Deno.env.get('DISCORD_BOT_TOKEN');
  const guildId = Deno.env.get('DISCORD_GUILD_ID');

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !discordBotToken || !guildId) {
    return response({ error: 'Discord-Synchronisierung ist noch nicht vollständig konfiguriert.' }, 500);
  }

  const authorization = request.headers.get('Authorization');
  if (!authorization) return response({ error: 'Nicht autorisiert.' }, 401);

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData.user) return response({ error: 'Supabase-Sitzung konnte nicht geprüft werden.' }, 401);

  const user = userData.user;
  const identity = user.identities?.find((item) => item.provider === 'discord');
  const metadata = {
    ...(user.user_metadata as DiscordIdentity | undefined),
    ...((identity?.identity_data ?? {}) as DiscordIdentity),
  };
  const discordId = metadata.provider_id ?? metadata.id ?? metadata.sub;

  if (!discordId) {
    return response({ connected: false, is_member: false, products: [] });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
    headers: { Authorization: `Bot ${discordBotToken}` },
  });

  const commonProfile = {
    discord_id: discordId,
    discord_username: metadata.username ?? '',
    discord_global_name: metadata.global_name ?? '',
    discord_avatar_url: metadata.avatar_url ?? null,
    discord_synced_at: new Date().toISOString(),
  };

  if (memberResponse.status === 404) {
    await adminClient.from('profiles').update(commonProfile).eq('id', user.id);
    await adminClient.from('discord_memberships').upsert({
      user_id: user.id,
      discord_user_id: discordId,
      guild_id: guildId,
      username: metadata.username ?? '',
      global_name: metadata.global_name ?? '',
      avatar_url: metadata.avatar_url ?? null,
      role_ids: [],
      is_member: false,
      synced_at: new Date().toISOString(),
    });
    await adminClient.from('user_product_access').delete().eq('user_id', user.id);
    return response({ connected: true, is_member: false, products: [] });
  }

  if (!memberResponse.ok) return response({ error: 'Discord-Mitgliedschaft konnte nicht geprüft werden.' }, 502);

  const member = await memberResponse.json() as { roles?: string[]; user?: DiscordIdentity };
  const discordUser = member.user ?? {};
  const roleIds = Array.isArray(member.roles) ? member.roles : [];
  const rolesResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${discordBotToken}` },
  });
  if (!rolesResponse.ok) return response({ error: 'Discord-Rollen konnten nicht geladen werden.' }, 502);
  const guildRoles = await rolesResponse.json() as Array<{ id: string; name: string }>;
  const roleNames = [...new Set(guildRoles.filter((role) => roleIds.includes(role.id)).map((role) => role.name))];
  let mappings: Array<{ product_id: string; grant: string }> = [];
  if (roleIds.length > 0) {
    const mappingResult = await adminClient
      .from('product_role_access')
      .select('product_id, discord_role_id')
      .in('discord_role_id', roleIds);
    if (mappingResult.error) return response({ error: 'Produktrollen konnten nicht geladen werden.' }, 500);
    mappings = (mappingResult.data ?? []).map((mapping) => ({ product_id: mapping.product_id, grant: mapping.discord_role_id }));
  }
  if (roleNames.length > 0) {
    const nameMappingResult = await adminClient
      .from('product_role_name_access')
      .select('product_id, discord_role_name')
      .in('discord_role_name', roleNames);
    if (nameMappingResult.error) return response({ error: 'Produktrollen konnten nicht geladen werden.' }, 500);
    mappings = [...mappings, ...(nameMappingResult.data ?? []).map((mapping) => ({ product_id: mapping.product_id, grant: mapping.discord_role_name }))];
  }

  const grants = new Map<string, string>();
  for (const mapping of mappings ?? []) {
    if (!grants.has(mapping.product_id)) grants.set(mapping.product_id, mapping.grant);
  }

  const syncedAt = new Date().toISOString();
  await adminClient.from('profiles').update({
    ...commonProfile,
    discord_username: discordUser.username ?? commonProfile.discord_username,
    discord_global_name: discordUser.global_name ?? commonProfile.discord_global_name,
    discord_avatar_url: discordUser.avatar_url ?? commonProfile.discord_avatar_url,
  }).eq('id', user.id);
  await adminClient.from('discord_memberships').upsert({
    user_id: user.id,
    discord_user_id: discordId,
    guild_id: guildId,
    username: discordUser.username ?? commonProfile.discord_username,
    global_name: discordUser.global_name ?? commonProfile.discord_global_name,
    avatar_url: discordUser.avatar_url ?? commonProfile.discord_avatar_url,
    role_ids: roleIds,
    is_member: true,
    synced_at: syncedAt,
  });
  await adminClient.from('user_product_access').delete().eq('user_id', user.id);
  if (grants.size > 0) {
    await adminClient.from('user_product_access').insert([...grants.entries()].map(([productId, roleId]) => ({
      user_id: user.id,
      product_id: productId,
      granted_via_role_id: roleId,
      granted_at: syncedAt,
      updated_at: syncedAt,
    })));
  }

  return response({
    connected: true,
    is_member: true,
    discord: {
      id: discordId,
      username: discordUser.username ?? commonProfile.discord_username,
      global_name: discordUser.global_name ?? commonProfile.discord_global_name,
      avatar_url: discordUser.avatar_url ?? commonProfile.discord_avatar_url,
    },
    products: [...grants.keys()],
  });
});
