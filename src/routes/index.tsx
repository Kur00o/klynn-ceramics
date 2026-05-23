import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import process from "@/assets/process.jpg";
import ugc1 from "@/assets/ugc1.jpg";
import ugc2 from "@/assets/ugc2.jpg";
import ugc3 from "@/assets/ugc3.jpg";
import { categoryMeta, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terra Studio — Handcrafted Ceramics" },
      { name: "description", content: "Handcrafted ceramics designed for everyday rituals. Bowls, plates, mugs and china sets, made slowly from raw earth." },
      { property: "og:title", content: "Terra Studio — Handcrafted Ceramics" },
      { property: "og:description", content: "Handcrafted ceramics for everyday rituals." },
      { property: "og:image", content: hero },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.bestseller).slice(0, 4);
  const bestsellers = products.filter((p) => p.bestseller);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={hero}
          alt="Editorial flat-lay of handcrafted ceramic bowls and plates on linen"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/15 via-transparent to-charcoal/45" />
        <div className="relative z-10 h-full container-editorial flex flex-col justify-end pb-20 md:pb-28">
          <div className="max-w-3xl fade-in">
            <p className="eyebrow text-parchment/85">Studio Terra · Est. 2014</p>
            <h1 className="serif text-parchment mt-6 text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.98]">
              Crafted from Earth.
              <br />
              <em className="font-normal italic opacity-90">Made to last.</em>
            </h1>
            <p className="mt-7 max-w-xl text-parchment/85 text-base md:text-lg leading-relaxed">
              Stoneware shaped slowly, by hand, in small kilns. Each piece is unique —
              designed for everyday rituals that deserve a little beauty.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/bowls" className="btn-primary">Explore Collection</Link>
              <a href="#story" className="btn-ghost border-parchment/70 text-parchment hover:bg-parchment hover:text-charcoal" style={{borderColor:"oklch(0.965 0.012 80 / 0.7)", color:"oklch(0.965 0.012 80)"}}>
                Our Story
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-hint text-parchment/80">
          <ArrowDown className="w-4 h-4" strokeWidth={1.4} />
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-editorial pt-28 md:pt-36">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <p className="eyebrow">No. 01 / Featured</p>
            <h2 className="serif text-4xl md:text-6xl mt-3">A small, considered edit.</h2>
          </div>
          <Link to="/bowls" className="link-underline text-[0.78rem] tracking-[0.22em] uppercase">
            Shop all <ArrowRight className="inline w-3.5 h-3.5 ml-1" strokeWidth={1.4} />
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {featured.map((p, i) => {
            const layouts = [
              "col-span-12 md:col-span-7 md:row-span-2",
              "col-span-6 md:col-span-5",
              "col-span-6 md:col-span-5 md:translate-y-12",
              "col-span-12 md:col-span-7 md:-translate-y-8",
            ];
            return (
              <div key={p.slug} className={layouts[i] ?? "col-span-6"}>
                <ProductCard p={p} />
              </div>
            );
          })}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="story" className="mt-32 md:mt-44 bg-secondary py-28 md:py-40">
        <div className="container-editorial max-w-4xl text-center">
          <p className="eyebrow">No. 02 / Philosophy</p>
          <blockquote className="serif italic text-3xl md:text-5xl leading-[1.15] mt-8">
            "We make slowly, on purpose. Clay remembers the hand that shaped it —
            and a quiet table holds more than dinner."
          </blockquote>
          <p className="mt-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every piece begins as raw clay from a single quarry, finished with lead-free glazes mixed
            in our studio. Nothing is rushed. Nothing is mass-made. The dust on our hands is part of the work.
          </p>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="container-editorial mt-32 md:mt-44">
        <p className="eyebrow">No. 03 / Collections</p>
        <h2 className="serif text-4xl md:text-6xl mt-3 mb-14">The whole table.</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5">
          {(["bowls","plates","mugs","gifting","china"] as const).map((k) => {
            const m = categoryMeta[k];
            return (
              <Link key={k} to={m.href} className="group relative aspect-[3/4] overflow-hidden bg-secondary block">
                <img src={m.image} alt={m.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-parchment">
                  <h3 className="serif text-2xl md:text-3xl">{m.title}</h3>
                  <p className="text-xs text-parchment/75 mt-1">{m.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mt-32 md:mt-44">
        <div className="container-editorial flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">No. 04 / Bestsellers</p>
            <h2 className="serif text-4xl md:text-6xl mt-3">Lived with, loved daily.</h2>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 md:gap-10 px-6 md:px-10 pb-4 min-w-max">
            {bestsellers.map((p) => (
              <div key={p.slug} className="w-72 md:w-96 shrink-0">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="container-editorial mt-32 md:mt-44 border-y border-border py-12">
        <p className="eyebrow text-center mb-8">As featured in</p>
        <div className="flex items-center justify-center gap-10 md:gap-20 flex-wrap text-muted-foreground/70">
          {["Kinfolk","Apartamento","Cereal","The World of Interiors","Architectural Digest"].map((n) => (
            <span key={n} className="serif italic text-xl md:text-2xl tracking-tight">{n}</span>
          ))}
        </div>
      </section>

      {/* MATERIAL STORY */}
      <section className="container-editorial mt-32 md:mt-44 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="aspect-[4/5] overflow-hidden bg-secondary">
          <img src={process} alt="Hands shaping wet clay on a potter's wheel" loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="md:pr-10">
          <p className="eyebrow">No. 06 / Material</p>
          <h2 className="serif text-4xl md:text-6xl mt-3 leading-[1.05]">A material with memory.</h2>
          <p className="mt-7 text-muted-foreground leading-relaxed">
            Our clay comes from a single quarry in the hills outside the studio. We blend it with grog and
            kaolin, age the body for weeks, and finish each piece by hand. The variations you see — a softer
            edge, a richer pool of glaze — are the language of the kiln.
          </p>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            We fire to stoneware temperatures so every piece is dishwasher safe and built to outlast trends.
          </p>
          <Link to="/contact" className="link-underline mt-10 inline-block text-[0.78rem] tracking-[0.22em] uppercase">
            Visit the studio <ArrowRight className="inline w-3.5 h-3.5 ml-1" strokeWidth={1.4} />
          </Link>
        </div>
      </section>

      {/* UGC */}
      <section className="container-editorial mt-32 md:mt-44">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="eyebrow">No. 07 / At Home</p>
            <h2 className="serif text-4xl md:text-6xl mt-3">In real rooms, real lives.</h2>
          </div>
          <span className="text-sm text-muted-foreground">@studio.terra</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {[ugc1, ugc2, ugc3, ugc1, ugc3, ugc2].map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-secondary">
              <img src={src} alt="Customer photo of ceramics in a home" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="mt-32 md:mt-44 bg-charcoal text-parchment py-24">
        <div className="container-editorial max-w-3xl text-center">
          <p className="eyebrow text-parchment/70">No. 08 / Quiet drops</p>
          <h2 className="serif text-4xl md:text-5xl mt-4">Join the waitlist for new drops.</h2>
          <p className="mt-5 text-parchment/70">Small batches. Sent only when there's something worth sending.</p>
          <form className="mt-10 flex max-w-md mx-auto border-b border-parchment/40 focus-within:border-parchment transition-colors">
            <input type="email" required placeholder="your@email.com" className="flex-1 bg-transparent py-3 text-base placeholder:text-parchment/40 focus:outline-none" />
            <button className="text-[0.72rem] tracking-[0.22em] uppercase">Join →</button>
          </form>
        </div>
      </section>
    </>
  );
}
