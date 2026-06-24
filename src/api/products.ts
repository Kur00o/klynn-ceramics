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
  let category: Category | null = null;
  
  // Prioritize gifting sets, as a set might also be in the 'bowls' or 'plates' collection
  if (collectionTitles.some(t => t.includes("gift") || t.includes("set"))) category = "gifting";
  else if (collectionTitles.some(t => t.includes("bowl"))) category = "bowls";
  else if (collectionTitles.some(t => t.includes("plate"))) category = "plates";
  else if (collectionTitles.some(t => t.includes("mug"))) category = "mugs";
  else {
    // Fallback to explicit tags if collection doesn't match
    const categoryTag = tags.find(t => t.startsWith('category:'))?.replace('category:', '') as Category;
    if (categoryTag && ["bowls", "plates", "mugs", "gifting"].includes(categoryTag)) {
      category = categoryTag;
    }
  }

  // If no explicit collection or category tag matches, ignore the product to prevent 
  // pulling in unrelated store products based purely on their title.
  if (!category) return null as any;
  
  const bestseller = tags.includes('bestseller');
  const newArrival = tags.includes('newArrival');
  
  const allImageNodes = shopifyProduct.images?.edges?.map((e: any) => e.node) || [];
  const allImages = allImageNodes.map((n: any) => n.url).filter(Boolean);
  
  if (shopifyProduct.featuredImage?.url && !allImages.includes(shopifyProduct.featuredImage.url)) {
    allImages.unshift(shopifyProduct.featuredImage.url);
  }
  
  const mappedVariants = shopifyProduct.variants?.edges?.map((e: any) => e.node) || [];
  mappedVariants.forEach((v: any) => {
    if (!v.image?.url) {
      const matchingImgNode = allImageNodes.find((img: any) => 
        img.altText && img.altText.toLowerCase().includes(v.title.toLowerCase())
      );
      if (matchingImgNode) {
        v.image = { url: matchingImgNode.url, altText: matchingImgNode.altText };
      }
    }

    if (v.image?.url && !allImages.includes(v.image.url)) {
      allImages.push(v.image.url);
    }
  });

  return {
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    descriptor: shopifyProduct.seo?.description || shopifyProduct.productType || shopifyProduct.title,
    price: Math.round(price),
    image,
    alt,
    category,
    bestseller,
    newArrival,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    materials: shopifyProduct.materials?.value || "Stoneware", 
    care: shopifyProduct.care?.value || "Dishwasher safe", 
    images: allImages.length > 0 ? allImages : [image, image, image, image],
    shopifyId: shopifyProduct.id,
    shopifyVariants: mappedVariants
  };
};

export async function fetchProducts() {
  try {
    const res = await shopifyFetch<any>({
      query: getProductsQuery,
      variables: { first: 250 }
    });
    const edges = res.body.data.products.edges;
    return edges.map((e: any) => mapShopifyProduct(e.node)).filter(Boolean) as Product[];
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
      const p = mapShopifyProduct(res.body.data.product);
      if (p) return p;
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
