import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts } from "@/api/products";
import catGifting from "@/assets/cat-gifting.jpg";

export const Route = createFileRoute("/gifting-sets")({
  head: () => ({
    meta: [
      { title: "Gifting Sets | Klynn Ceramics" },
      { name: "description", content: "Curated gifting sets, hand-wrapped in raw linen and twine." },
      { property: "og:image", content: catGifting },
    ],
  }),
  component: GiftingPage,
});

const TAGS: Record<string, string[]> = {
  "the-host": ["The Host", "Anniversary"],
  "first-home": ["Housewarming", "First Home"],
  "morning-ritual": ["Couple", "Daily Ritual"],
  "anniversary-set": ["Anniversary", "Heirloom"],
};

function GiftingPage() {
  const { data: allProducts = [], isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  
  const items = useMemo(() => {
    return allProducts.filter(p => p.category === "gifting" && (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [allProducts, searchQuery]);

  return (
    <div className="pt-28 md:pt-36">
      <section className="container-editorial">
        <header className="max-w-2xl mb-16 fade-in">
          <p className="eyebrow">Considered Gifting</p>
          <h1 className="serif text-5xl md:text-7xl mt-4">Sets, hand-wrapped.</h1>
          <p className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed mb-10">
            Curated collections paired and wrapped by hand in raw linen and twine. A gift that arrives
            already feeling lived-with.
          </p>
          <input
            type="text"
            placeholder="Search gifting sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-border text-sm focus:outline-none focus:border-primary pb-1 w-full md:w-64 placeholder:text-muted-foreground/50 transition-colors"
          />
        </header>

        <div className="space-y-24 md:space-y-32">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">Loading gifting sets...</div>
          ) : (
            items.map((p, i) => (
              <article
                key={p.slug}
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              >
                <Link to="/product/$slug" params={{ slug: p.slug }} className="block aspect-[4/5] overflow-hidden bg-secondary md:[direction:ltr]">
                  <img src={p.image} alt={p.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105" />
                </Link>
                <div className="md:[direction:ltr]">
                  <p className="eyebrow">Set {String(i + 1).padStart(2, "0")}</p>
                  <h2 className="serif text-4xl md:text-5xl mt-4">{p.name}</h2>
                  <p className="text-muted-foreground mt-4">{p.descriptor}</p>
                  <p className="mt-6 leading-relaxed text-foreground/90 max-w-md">
                    {p.description ?? "A considered pairing of pieces from across the collection, hand-finished in matching tones."}
                  </p>
                  <ul className="mt-8 space-y-2 text-sm text-muted-foreground border-l border-border pl-5">
                    <li>2 hand-thrown bowls</li>
                    <li>2 side plates</li>
                    <li>2 hand-pulled mugs</li>
                    <li>Wrapped in raw linen and twine</li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {(TAGS[p.slug] ?? ["Curated"]).map((t) => (
                      <span key={t} className="text-[0.7rem] tracking-[0.22em] uppercase border border-border px-3 py-1 text-muted-foreground">
                        Perfect for · {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-10 flex items-center gap-8">
                    <span className="serif text-3xl">₹{p.price}</span>
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="btn-primary">View set</Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
