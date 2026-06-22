import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/data/products";
import { createCart, getCart, addToCart, removeFromCart, updateCart } from "@/api/cart";

type Item = { product: Product; qty: number; lineId: string };
type CartCtx = {
  items: Item[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product) => void;
  remove: (slug: string) => void;
  update: (slug: string, qty: number) => void;
  checkoutUrl?: string;
  isUpdating: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem("shopify_cart_id");
    if (stored) setCartId(stored);
  }, []);

  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => getCart(cartId!),
    enabled: !!cartId,
  });

  const createCartMut = useMutation({
    mutationFn: createCart,
    onSuccess: (data) => {
      setCartId(data.id);
      localStorage.setItem("shopify_cart_id", data.id);
      queryClient.setQueryData(["cart", data.id], data);
    }
  });

  const addMut = useMutation({
    mutationFn: ({ cId, variantId }: { cId: string; variantId: string }) => addToCart(cId, variantId, 1),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["cart", variables.cId], data);
      setOpen(true);
    }
  });

  const removeMut = useMutation({
    mutationFn: ({ cId, lineId }: { cId: string; lineId: string }) => removeFromCart(cId, lineId),
    onSuccess: (data, variables) => queryClient.setQueryData(["cart", variables.cId], data)
  });

  const updateMut = useMutation({
    mutationFn: ({ cId, lineId, quantity }: { cId: string; lineId: string; quantity: number }) => updateCart(cId, lineId, quantity),
    onSuccess: (data, variables) => queryClient.setQueryData(["cart", variables.cId], data)
  });

  const items: Item[] = useMemo(() => {
    if (!cartData?.lines?.edges) return [];
    return cartData.lines.edges.map((e: any) => {
      const node = e.node;
      const merch = node.merchandise;
      const prod = merch.product;
      // We reconstruct enough of the Product type for the CartDrawer to work
      const p: Partial<Product> = {
        slug: prod.handle,
        name: prod.title,
        price: parseFloat(merch.price.amount),
        image: prod.featuredImage?.url || prod.images?.edges?.[0]?.node?.url || "",
        alt: prod.featuredImage?.altText || prod.images?.edges?.[0]?.node?.altText || prod.title
      };
      return { product: p as Product, qty: node.quantity, lineId: node.id };
    });
  }, [cartData]);

  const value = useMemo<CartCtx>(() => ({
    items,
    open,
    setOpen,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: parseFloat(cartData?.cost?.totalAmount?.amount || "0"),
    checkoutUrl: cartData?.checkoutUrl 
      ? cartData.checkoutUrl.replace("checkout.klynnceramics.com", "klynn-ceramics.myshopify.com")
      : undefined,
    isUpdating: createCartMut.isPending || addMut.isPending || removeMut.isPending || updateMut.isPending,
    add: async (p) => {
      // Find variant ID. Since we attached it to the product object during mapping, we use it. 
      // If it's missing (fallback data), we can't reliably add to Shopify cart, but we'll try.
      const variantId = (p as any).shopifyVariants?.[0]?.id;
      if (!variantId) {
        console.warn("No variant ID found for product", p.slug);
        return;
      } 

      const existing = items.find((i) => i.product.slug === p.slug);
      let activeCartId = cartId;

      if (!activeCartId) {
        const newCart = await createCartMut.mutateAsync();
        activeCartId = newCart.id;
      }

      if (existing) {
        updateMut.mutate({ cId: activeCartId, lineId: existing.lineId, quantity: existing.qty + 1 });
        setOpen(true);
      } else {
        addMut.mutate({ cId: activeCartId, variantId });
      }
    },
    remove: (slug) => {
      if (!cartId) return;
      const line = items.find(i => i.product.slug === slug);
      if (line) removeMut.mutate({ cId: cartId, lineId: line.lineId });
    },
    update: (slug, qty) => {
      if (!cartId) return;
      const line = items.find(i => i.product.slug === slug);
      if (line) {
        if (qty <= 0) removeMut.mutate({ cId: cartId, lineId: line.lineId });
        else updateMut.mutate({ cId: cartId, lineId: line.lineId, quantity: qty });
      }
    },
  }), [items, open, cartId, cartData, createCartMut.isPending, addMut.isPending, removeMut.isPending, updateMut.isPending]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
