import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, currency } from "@/hooks/use-cart";
import { useCartDrawer } from "@/components/cart/cart-drawer-context";
import { useStoredIds } from "@/hooks/use-stored-ids";
import RatingStars from "@/components/product/rating-stars";

export default function ProductCard({ product, layout = "grid" }) {
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const wishlist = useStoredIds("wishlist");

  if (!product) return null;

  const { id, title, price, image, brand, categoryTitle } = product;
  const rating = product?.rating?.rate ?? 0;
  const inStock = (product.stock ?? 10) > 0;
  const wished = wishlist.has(id);

  const addToCart = () => {
    cart.add(product);
    toast.success("Added to cart", {
      description: title,
      action: {
        label: "View cart",
        onClick: openDrawer,
      },
    });
  };

  const toggleWishlist = () => {
    wishlist.toggle(id);
    toast.success(wished ? "Removed from wishlist" : "Saved to wishlist", {
      description: title,
    });
  };

  if (layout === "list") {
    return (
      <Card className="gap-4 py-4 transition-colors hover:border-foreground/20 sm:flex-row sm:items-center">
        <Link
          to={`/product/${id}`}
          className="relative block h-40 shrink-0 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28"
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {categoryTitle && (
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {categoryTitle}
            </span>
          )}
          <Link to={`/product/${id}`} className="truncate font-medium hover:underline">
            {title}
          </Link>
          {brand && <span className="text-xs text-muted-foreground">{brand}</span>}
          <RatingStars value={rating} count={product?.rating?.count} showValue />
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <span className="text-lg font-semibold tabular-nums">{currency(price)}</span>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleWishlist}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
            </Button>
            <Button size="sm" onClick={addToCart} disabled={!inStock}>
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5 focus-within:shadow-md">
      <CardContent className="flex h-full flex-col gap-3 p-0">
        <Link
          to={`/product/${id}`}
          className="relative block aspect-square overflow-hidden bg-muted"
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!inStock && (
            <Badge variant="secondary" className="absolute left-2 top-2">
              Sold out
            </Badge>
          )}
          {inStock && (product.stock ?? 0) <= 5 && (
            <Badge className="absolute left-2 top-2">Only {product.stock} left</Badge>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
          {categoryTitle && (
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {categoryTitle}
            </span>
          )}
          <Link
            to={`/product/${id}`}
            className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
          >
            {title}
          </Link>
          <RatingStars value={rating} showValue />
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <span className="text-base font-semibold tabular-nums">{currency(price)}</span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={toggleWishlist}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={addToCart}
                disabled={!inStock}
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <div className="aspect-square animate-pulse bg-muted" />
      <CardContent className="space-y-2 p-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}