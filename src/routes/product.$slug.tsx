import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { type Product } from "@/data/products";
import { fetchProduct, useProducts } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/components/cart-context";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: allProducts = [] } = useProducts();
  const related = allProducts.filter((x) => x.category === p.category && x.slug !== p.slug);

  const allImages = Array.from(new Set(p.images && p.images.length > 0 ? p.images : [p.image]));

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + allImages.length) % allImages.length);

  return (
    <div className="pt-28 md:pt-36">
      <div className="container-editorial">
        <Link 
          to={p.category === "gifting" ? "/gifting-sets" : `/${p.category}`} 
          className="text-[0.72rem] tracking-[0.22em] uppercase text-muted-foreground hover:text-primary"
        >
          ← Back to {p.category.replace("-", " ")}
        </Link>
      </div>
      <section className="container-editorial mt-8 grid md:grid-cols-2 gap-10 md:gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="relative aspect-square overflow-hidden bg-secondary group">
            <img 
              src={allImages[currentImageIndex]} 
              alt={p.alt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((src, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentImageIndex(i)} 
                  className={`relative aspect-square overflow-hidden bg-secondary group focus:outline-none ${i === currentImageIndex ? 'ring-1 ring-primary ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="md:pt-6 md:sticky md:top-28 md:self-start"
        >
          <p className="eyebrow">{p.category}</p>
          <h1 className="serif text-4xl md:text-6xl mt-4 leading-[1.05]">{p.name}</h1>
          <p className="text-muted-foreground mt-3">{p.descriptor}</p>
          <p className="serif text-3xl mt-8">₹{p.price}</p>

          <button onClick={() => add(p)} className="btn-primary mt-8 w-full md:w-auto">Add to cart</button>

          <div className="mt-12 border-t border-border">
            <div className="flex gap-8 pt-5 text-[0.72rem] tracking-[0.22em] uppercase">
              {(["desc","materials","care"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={tab === t ? "text-primary" : "text-muted-foreground transition-colors hover:text-foreground"}>
                  {t === "desc" ? "Description" : t === "materials" ? "Materials" : "Care"}
                </button>
              ))}
            </div>
            <div className="mt-5 text-sm leading-relaxed text-foreground/90 min-h-[6rem] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === "desc" && (
                    p.descriptionHtml ? 
                      <div dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} className="space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5" /> 
                    : <div className="whitespace-pre-wrap">{p.description ?? "A piece from the Klynn collection. Hand-thrown, glazed by hand, and fired slowly."}</div>
                  )}
                  {tab === "materials" && <div className="whitespace-pre-wrap">{p.materials ?? "Local stoneware clay, lead-free matte glaze."}</div>}
                  {tab === "care" && <div className="whitespace-pre-wrap">{p.care ?? "Dishwasher safe. Avoid sudden temperature changes."}</div>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6 }}
            className="container-editorial mb-10"
          >
            <p className="eyebrow">You may also like</p>
            <h2 className="serif text-3xl md:text-5xl mt-3">More from {p.category}.</h2>
          </motion.div>
          <div className="overflow-x-auto no-scrollbar pb-4">
            <div className="flex gap-6 md:gap-10 scroll-pl pr-6 md:pr-10 min-w-max">
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
