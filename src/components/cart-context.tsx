import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

type Item = { product: Product; qty: number };
type CartCtx = {
  items: Item[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product) => void;
  remove: (slug: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartCtx>(() => ({
    items,
    open,
    setOpen,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.product.price, 0),
    add: (p) => {
      setItems((prev) => {
        const found = prev.find((i) => i.product.slug === p.slug);
        if (found) return prev.map((i) => i.product.slug === p.slug ? { ...i, qty: i.qty + 1 } : i);
        return [...prev, { product: p, qty: 1 }];
      });
      setOpen(true);
    },
    remove: (slug) => setItems((prev) => prev.filter((i) => i.product.slug !== slug)),
  }), [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
