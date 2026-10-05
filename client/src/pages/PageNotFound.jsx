import { Link } from "react-router-dom";
import { Compass, Home, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const suggestions = [
  { label: "Shop all products", to: "/product", icon: ShoppingBag },
  { label: "Your cart", to: "/cart", icon: Compass },
  { label: "Wishlist", to: "/wishlist", icon: Search },
];

export default function PageNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-6xl font-semibold tracking-tight text-muted-foreground/30">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        This page went out of stock
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The link may be broken, or the product might have been removed from the shop.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/product">Browse products</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full">
        <CardContent className="grid gap-2 p-4 sm:grid-cols-3">
          {suggestions.map(({ label, to, icon: Icon }) => (
            <Button key={to} asChild variant="ghost" className="justify-start gap-2">
              <Link to={to}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}