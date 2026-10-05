import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const year = new Date().getFullYear();

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/product" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
      { label: "Checkout", to: "/checkout" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Contact us", to: "/contact" },
      { label: "About", to: "/about" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-tight">Ecommerce</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              A small demo storefront with a real backend, admin dashboard,
              Telegram and WhatsApp checkout.
            </p>
            <Badge variant="secondary" className="gap-1">
              React 19 · Vite · Tailwind
            </Badge>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Ecommerce. Built for the demo shop.
          </p>
          <Button asChild variant="link" className="h-auto p-0 text-sm">
          </Button>
        </div>
      </div>
    </footer>
  );
}
