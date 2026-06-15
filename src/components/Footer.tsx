import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-secondary/40">
      <div className="container-editorial py-20 grid gap-12 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Klynn" className="h-8 md:h-10 w-auto object-contain" />
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
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Connect</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
          </ul>
          <div className="flex gap-4 mt-6 text-foreground/70">
            <a href="https://instagram.com/klynn.ceramics" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="w-4 h-4" strokeWidth={1.4} /></a>
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
