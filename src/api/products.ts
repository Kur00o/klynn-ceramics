import { useQuery } from '@tanstack/react-query';
import { shopifyFetch } from '@/lib/shopify';
import { getProductsQuery, getProductByHandleQuery } from './shopifyQueries';
import { fallbackProducts, type Product, type Category } from '@/data/products';

const mapShopifyProduct = (shopifyProduct: any): Product & { shopifyId: string; shopifyVariants: any[] } => {
  const price = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || "0");
  const image = shopifyProduct.featuredImage?.url || shopifyProduct.images?.edges?.[0]?.node?.url || fallbackProducts[0].image; // fallback to prevent broken UI
  const alt = shopifyProduct.featuredImage?.altText || shopifyProduct.images?.edges?.[0]?.node?.altText || shopifyProduct.title;
  
  const tags: string[] = shopifyProduct.tags || [];
  
  // Try to map from collections first
  const collectionTitles: string[] = (shopifyProduct.collections?.edges || []).map((e: any) => e.node.title.toLowerCase());
  let category: Category = "bowls";
  if (collectionTitles.some(t => t.includes("bowl"))) category = "bowls";
  else if (collectionTitles.some(t => t.includes("plate"))) category = "plates";
  else if (collectionTitles.some(t => t.includes("mug"))) category = "mugs";
  else if (collectionTitles.some(t => t.includes("gift"))) category = "gifting";
  else {
    // Fallback to tags if collection doesn't match
    const categoryTag = tags.find(t => t.startsWith('category:'))?.replace('category:', '') as Category;
    if (categoryTag) category = categoryTag;
  }
  
  const bestseller = tags.includes('bestseller');
  const newArrival = tags.includes('newArrival');
  
  return {
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    descriptor: shopifyProduct.productType || shopifyProduct.title,
    price: Math.round(price),
    image,
    alt,
    category,
    bestseller,
    newArrival,
    description: shopifyProduct.description,
    materials: "Stoneware", 
    care: "Dishwasher safe", 
    shopifyId: shopifyProduct.id,
    shopifyVariants: shopifyProduct.variants?.edges?.map((e: any) => e.node) || []
  };
};

export async function fetchProducts() {
  try {
    const res = await shopifyFetch<any>({
      query: getProductsQuery,
      variables: { first: 250 }
    });
    const edges = res.body.data.products.edges;
    return edges.map((e: any) => mapShopifyProduct(e.node));
  } catch (err) {
    console.warn("Falling back to mock products", err);
    return fallbackProducts;
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
}

export async function fetchProduct(slug: string) {
  try {
    const res = await shopifyFetch<any>({
      query: getProductByHandleQuery,
      variables: { handle: slug }
    });
    if (res.body.data.product) {
      return mapShopifyProduct(res.body.data.product);
    }
    throw new Error("Product not found");
  } catch (err) {
    console.warn("Falling back to mock product", err);
    const p = fallbackProducts.find(p => p.slug === slug);
    if (!p) throw new Error("Product not found");
    return p;
  }
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug)
  });
}
