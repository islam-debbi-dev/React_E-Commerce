import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  LayoutGrid,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useCartDrawer } from "@/components/cart/cart-drawer-context";
import ThemeToggle from "@/components/theme-toggle";
import { useStoredIds } from "@/hooks/use-stored-ids";

const links = [
  { to: "/product", label: "Shop", icon: LayoutGrid },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="text-base">Ecommerce</span>
    </Link>
  );
}

export default function Navbar() {
  const { itemCount } = useCart();
  const { openDrawer } = useCartDrawer();
  const wishlist = useStoredIds("wishlist");
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [mobileOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(term.trim() ? `/product?q=${encodeURIComponent(term.trim())}` : "/product");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle asChild>
                <div>
                  <Brand />
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-3">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive ? "bg-accent font-medium" : "text-muted-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Brand />

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
              {to === "/wishlist" && wishlist.ids.length > 0 && (
                <Badge variant="secondary" className="px-1.5 tabular-nums">
                  {wishlist.ids.length}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="h-9 pl-8"
            />
          </div>
        </form>

        <div className={cn("ml-auto flex items-center gap-1 md:ml-0")}>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
            <Link to="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.ids.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {wishlist.ids.length}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={openDrawer}>
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <Badge variant="secondary" className="tabular-nums">
              {itemCount}
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
}
