import { ProductDetail } from '@/components/shop-client';
import { products } from '@/lib/data/products';

export function generateStaticParams() { return products.map((product) => ({ id: product.id })); }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
