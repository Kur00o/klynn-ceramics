import { X } from "lucide-react";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const { open, setOpen, items, remove, update, total, checkoutUrl, isUpdating } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-charcoal/40 z-50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-background border-l border-border transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <p className="eyebrow">Your Cart</p>
          <button onClick={() => setOpen(false)} aria-label="Close cart">
            <X className="w-5 h-5" strokeWidth={1.4} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-13rem)] p-6 space-y-6">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty. The good ones take time to find.</p>
          ) : (
            items.map((i) => (
              <div key={i.lineId} className={`flex gap-4 ${isUpdating ? "opacity-50" : ""}`}>
                <img src={i.product.image} alt={i.product.alt} className="w-20 h-20 object-cover" />
                <div className="flex-1">
                  <p className="serif text-lg leading-tight">{i.product.name}</p>
                  <div className="flex items-center gap-3 mt-2 border border-border w-fit px-2 py-1 rounded-sm">
                    <button 
                      onClick={() => update(i.lineId, i.qty - 1)}
                      disabled={isUpdating}
                      className="text-muted-foreground hover:text-foreground px-1 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-xs w-4 text-center">{i.qty}</span>
                    <button 
                      onClick={() => update(i.lineId, i.qty + 1)}
                      disabled={isUpdating}
                      className="text-muted-foreground hover:text-foreground px-1 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i.lineId)}
                    disabled={isUpdating}
                    className="mt-2 text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Remove"}
                  </button>
                </div>
                <p className="text-sm">₹{i.product.price * i.qty}</p>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0 border-t border-border p-6 bg-background">
          <div className="flex items-baseline justify-between mb-4">
            <span className="eyebrow">Subtotal</span>
            <span className="serif text-2xl">₹{total}</span>
          </div>
          {checkoutUrl ? (
            <button 
              onClick={() => {
                if (checkoutUrl && items.length > 0) window.location.href = checkoutUrl;
              }}
              className={`btn-primary w-full text-center block ${items.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`} 
              disabled={items.length === 0}
            >
              Checkout securely
            </button>
          ) : (
            <button className="btn-primary w-full disabled:opacity-50" disabled={items.length === 0}>
              Checkout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
