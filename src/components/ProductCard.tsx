import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

export function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: p.slug }}
        className="group block"
      >
        <div className="relative overflow-hidden bg-secondary/50 aspect-square">
          <img
            src={p.image}
            alt={p.alt}
            loading={eager ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          {p.newArrival && (
            <span className="absolute top-4 left-4 bg-background/90 text-[0.65rem] tracking-[0.22em] uppercase px-2.5 py-1">
              New
            </span>
          )}
        </div>
        <div className="pt-2 pb-0 flex items-baseline justify-between gap-4">
          <div>
            <h3 className="serif text-xl leading-tight">{p.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{p.descriptor}</p>
          </div>
          <p className="text-sm tabular-nums">₹{p.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}
