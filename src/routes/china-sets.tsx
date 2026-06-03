import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useProducts } from "@/api/products";
import catChina from "@/assets/cat-china.jpg";

export const Route = createFileRoute("/china-sets")({
  head: () => ({
    meta: [
      { title: "China Sets | Klynn Ceramics" },
      { name: "description", content: "Complete china sets in considered earth tones. Service for 4, 6, or 8." },
      { property: "og:image", content: catChina },
    ],
  }),
  component: ChinaPage,
});

const SIZES = [4, 6, 8] as const;

function ChinaPage() {
  const { data: allProducts = [], isLoading } = useProducts();
  const items = useMemo(() => allProducts.filter((p) => p.category === "china"), [allProducts]);
  const [size, setSize] = useState<(typeof SIZES)[number]>(6);
  const factor = size / 4;

  return (
    <div className="pt-20 md:pt-24">
      <div className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
        <img src={catChina} alt="China set table flat-lay" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/40 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-editorial pb-16">
            <p className="eyebrow text-parchment/85">Heirloom Sets</p>
            <h1 className="serif text-5xl md:text-7xl text-parchment mt-3 max-w-3xl leading-[1]">A complete table, in earth.</h1>
          </div>
        </div>
      </div>

      <section className="container-editorial mt-20">
        <div className="max-w-2xl mb-10">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Plates, side plates, bowls and tumblers in matching tones. Designed to be lived with, scratched a little,
            handed down. Customise the service size below.
          </p>
        </div>

        <div className="flex items-center gap-6 mb-12 border-y border-border py-5">
          <span className="eyebrow">Customize set</span>
          <div className="flex gap-3">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-5 py-2 text-[0.72rem] tracking-[0.22em] uppercase border transition-colors ${
                  size === s ? "bg-charcoal text-parchment border-charcoal" : "border-border hover:border-charcoal"
                }`}
              >
                Service for {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">Loading china sets...</div>
          ) : (
            items.map((p) => (
              <article key={p.slug}>
                <Link to="/product/$slug" params={{ slug: p.slug }} className="block aspect-square overflow-hidden bg-secondary">
                  <img src={p.image} alt={p.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105" />
                </Link>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="serif text-2xl">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Service for {size} · {size * 4} pieces</p>
                  </div>
                  <p className="serif text-xl tabular-nums">${Math.round(p.price * factor)}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
