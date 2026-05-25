import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { byCategory, type Category } from "@/data/products";

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
  const items = byCategory(category);
  const [sort, setSort] = useState<Sort>("new");

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
        <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden mb-20">
          <img src={hero} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/40 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal/70" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-editorial pb-12">
              <p className="eyebrow text-parchment/80">Collection</p>
              <h1 className="serif text-5xl md:text-7xl text-parchment mt-3">{title}</h1>
            </div>
          </div>
        </div>
      )}

      <section className="container-editorial">
        {!hero && (
          <header className="max-w-2xl mb-14 fade-in">
            <p className="eyebrow">Collection</p>
            <h1 className="serif text-5xl md:text-7xl mt-4">{title}</h1>
            <p className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed">{intro}</p>
          </header>
        )}
        {hero && (
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed mb-14">{intro}</p>
        )}

        <div className="flex items-center justify-between border-y border-border py-4 mb-12">
          <span className="eyebrow">{sorted.length} pieces</span>
          <div className="flex gap-6 text-[0.72rem] tracking-[0.22em] uppercase">
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
          {sorted.map((p, i) => (
            <ProductCard key={p.slug} p={p} eager={i < 2} />
          ))}
        </div>
      </section>
    </div>
  );
}
