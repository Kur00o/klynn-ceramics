import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart-context";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/bowls", label: "Bowls" },
  { to: "/plates", label: "Plates" },
  { to: "/mugs", label: "Mugs" },
  { to: "/gifting-sets", label: "Gifting Sets" },
  { to: "/china-sets", label: "China Sets" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    let last = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y > 80 && y > last) setHidden(true);
      else setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDarkHeroPage = location.pathname === "/" || location.pathname === "/china-sets";
  const isLight = isDarkHeroPage && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"}`}
    >
      <div className="container-editorial flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className={`serif text-xl md:text-2xl tracking-tight transition-colors duration-300 ${
            isLight ? "text-parchment" : "text-foreground"
          }`}
        >
          Klynn<span className="text-primary">.</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className={`text-[0.78rem] tracking-[0.22em] uppercase transition-colors duration-300 ${
                isLight ? "text-parchment/80 hover:text-parchment" : "text-foreground/80 hover:text-primary"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            className={`relative inline-flex items-center justify-center transition-colors duration-300 ${
              isLight ? "text-parchment hover:text-parchment/80" : "text-foreground hover:text-primary"
            }`}
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.4} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 text-[10px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`lg:hidden transition-colors duration-300 ${
              isLight ? "text-parchment hover:text-parchment/80" : "text-foreground hover:text-primary"
            }`}
          >
            <Menu className="w-5 h-5" strokeWidth={1.4} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background fade-in lg:hidden">
          <div className="container-editorial flex items-center justify-between h-16">
            <Link to="/" onClick={() => setOpen(false)} className="serif text-xl">
              Klynn<span className="text-primary">.</span>
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5" strokeWidth={1.4} />
            </button>
          </div>
          <nav className="container-editorial flex flex-col gap-6 mt-12">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="serif text-3xl text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
