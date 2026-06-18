import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import type { Category } from "@/data/products";
import { useProducts } from "@/api/products";
import { motion } from "framer-motion";

type Sort = "new" | "best" | "low" | "high";

export function CategoryPage({
  category,
  title,
  intro,
  hero,
}: {
  category: Category;
  title: string;
  intro: string;
  hero?: string;
}) {
  const { data: allProducts = [], isLoading } = useProducts();
  const [sort, setSort] = useState<Sort>("new");
  const [searchQuery, setSearchQuery] = useState("");

  const items = useMemo(() => {
    return allProducts.filter((p) => {
      if (p.category !== category) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allProducts, category, searchQuery]);

  const sorted = useMemo(() => {
    const arr = [...items];
    if (sort === "new") arr.sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival));
    if (sort === "best") arr.sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    if (sort === "high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [items, sort]);

  return (
    <div className="pt-28 md:pt-36">
      {hero && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[55vh] min-h-[380px] w-full overflow-hidden mb-20"
        >
          <img src={hero} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/40 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal/70" />
          <div className="absolute inset-0 flex items-end">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="container-editorial pb-12"
            >
              <p className="eyebrow text-parchment/80">Collection</p>
              <h1 className="serif text-5xl md:text-7xl text-parchment mt-3">{title}</h1>
            </motion.div>
          </div>
        </motion.div>
      )}

      <section className="container-editorial">
        {!hero && (
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-14"
          >
            <p className="eyebrow">Collection</p>
            <h1 className="serif text-5xl md:text-7xl mt-4">{title}</h1>
            <p className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed">{intro}</p>
          </motion.header>
        )}
        {hero && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed mb-14"
          >
            {intro}
          </motion.p>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-border py-4 mb-12 gap-4">
          <div className="flex items-center gap-6">
            <span className="eyebrow">{sorted.length} pieces</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-border text-sm focus:outline-none focus:border-primary pb-1 w-48 placeholder:text-muted-foreground/50 transition-colors"
            />
          </div>
          <div className="flex gap-4 md:gap-6 text-[0.72rem] tracking-[0.22em] uppercase overflow-x-auto whitespace-nowrap pb-2 md:pb-0 hide-scrollbar">
            {([["new","New"],["best","Bestsellers"],["low","Price: Low"],["high","Price: High"]] as const).map(([k,l]) => (
              <button
                key={k}
                onClick={() => setSort(k as Sort)}
                className={`transition-colors ${sort === k ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">Loading collection...</div>
          ) : (
            sorted.map((p, i) => (
              <ProductCard key={p.slug} p={p} eager={i < 2} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
