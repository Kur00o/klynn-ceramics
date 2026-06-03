import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { type Product } from "@/data/products";
import { fetchProduct, useProducts } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/components/cart-context";
import { useState } from "react";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const p = await fetchProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} | Klynn Ceramics` },
      { name: "description", content: loaderData.descriptor },
      { property: "og:title", content: `${loaderData.name} | Klynn Ceramics` },
      { property: "og:image", content: loaderData.image },
    ] : [],
  }),
  component: PDP,
  notFoundComponent: () => (
    <div className="pt-40 container-editorial text-center">
      <h1 className="serif text-5xl">Not found</h1>
      <Link to="/" className="link-underline mt-6 inline-block">Back home</Link>
    </div>
  ),
});

function PDP() {
  const p = Route.useLoaderData() as Product;
  const { add } = useCart();
  const [tab, setTab] = useState<"desc" | "materials" | "care">("desc");
  const { data: allProducts = [] } = useProducts();
  const related = allProducts.filter((x) => x.category === p.category && x.slug !== p.slug);

  return (
    <div className="pt-28 md:pt-36">
      <div className="container-editorial">
        <Link to="/" className="text-[0.72rem] tracking-[0.22em] uppercase text-muted-foreground hover:text-primary">← Back</Link>
      </div>
      <section className="container-editorial mt-8 grid md:grid-cols-2 gap-10 md:gap-20">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden bg-secondary">
            <img src={p.image} alt={p.alt} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[p.image, p.image, p.image].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-secondary">
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div className="md:pt-6 md:sticky md:top-28 md:self-start">
          <p className="eyebrow">{p.category}</p>
          <h1 className="serif text-4xl md:text-6xl mt-4 leading-[1.05]">{p.name}</h1>
          <p className="text-muted-foreground mt-3">{p.descriptor}</p>
          <p className="serif text-3xl mt-8">₹{p.price}</p>

          <button onClick={() => add(p)} className="btn-primary mt-8 w-full md:w-auto">Add to cart</button>

          <div className="mt-12 border-t border-border">
            <div className="flex gap-8 pt-5 text-[0.72rem] tracking-[0.22em] uppercase">
              {(["desc","materials","care"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={tab === t ? "text-primary" : "text-muted-foreground"}>
                  {t === "desc" ? "Description" : t === "materials" ? "Materials" : "Care"}
                </button>
              ))}
            </div>
            <div className="mt-5 text-sm leading-relaxed text-foreground/90 min-h-[6rem]">
              {tab === "desc" && (p.description ?? "A piece from the Klynn collection. Hand-thrown, glazed by hand, and fired slowly.")}
              {tab === "materials" && (p.materials ?? "Local stoneware clay, lead-free matte glaze.")}
              {tab === "care" && (p.care ?? "Dishwasher safe. Avoid sudden temperature changes.")}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-32">
          <div className="container-editorial mb-10">
            <p className="eyebrow">You may also like</p>
            <h2 className="serif text-3xl md:text-5xl mt-3">More from {p.category}.</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-6 md:gap-10 px-6 md:px-10 pb-4 min-w-max">
              {related.map((r) => (
                <div key={r.slug} className="w-72 md:w-96 shrink-0">
                  <ProductCard p={r} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
