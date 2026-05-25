import { Link } from "@tanstack/react-router";
import { Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-secondary/40">
      <div className="container-editorial py-20 grid gap-12 md:grid-cols-4">
        <div>
          <Link to="/" className="serif text-2xl">
            Klynn<span className="text-primary">.</span>
          </Link>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
            Ceramics shaped slowly, by hand, from raw earth, made for tables that hold a moment.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/bowls" className="link-underline">Bowls</Link></li>
            <li><Link to="/plates" className="link-underline">Plates</Link></li>
            <li><Link to="/mugs" className="link-underline">Mugs</Link></li>
            <li><Link to="/gifting-sets" className="link-underline">Gifting Sets</Link></li>
            <li><Link to="/china-sets" className="link-underline">China Sets</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Studio</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
            <li><span className="text-muted-foreground">Visit by appointment</span></li>
            <li><span className="text-muted-foreground">Care &amp; Repair</span></li>
            <li><span className="text-muted-foreground">Trade enquiries</span></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Newsletter</p>
          <p className="text-sm text-muted-foreground mb-3">Quiet notes from the studio. New drops, no spam.</p>
          <form className="flex border-b border-foreground/40 focus-within:border-primary transition-colors">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <button className="text-[0.7rem] tracking-[0.22em] uppercase text-foreground hover:text-primary transition-colors">
              Join
            </button>
          </form>
          <div className="flex gap-4 mt-6 text-foreground/70">
            <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="w-4 h-4" strokeWidth={1.4} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="w-4 h-4" strokeWidth={1.4} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-editorial py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Klynn Ceramics. Made slowly.</span>
          <span>Stoneware, dust and patience.</span>
        </div>
      </div>
    </footer>
  );
}
