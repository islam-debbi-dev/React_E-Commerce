import { Link } from "react-router-dom";
import { ArrowRight, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import ProductCard, { ProductCardSkeleton } from "@/components/product/product-card";
import QuantityStepper from "@/components/product/quantity-stepper";
import EmptyState from "@/components/empty-state";
import { useCart, currency } from "@/hooks/use-cart";
import { useRecentlyViewedProducts } from "@/hooks/use-recently-viewed";

export default function CartPage() {
  const { items, subtotal, shipping, total, changeQty, remove } = useCart();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        <p className="text-sm text-muted-foreground">
          {items.length
            ? `${items.length} ${items.length === 1 ? "line" : "lines"} ready to check out`
            : "Your cart is waiting for something good"}
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Once you add products they will show up here with quantity controls and totals."
          actionLabel="Browse products"
          actionTo="/product"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id}>
                <Card>
                  <CardContent className="flex gap-4 p-4">
                    <Link
                      to={`/product/${item.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {item.categoryTitle && (
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              {item.categoryTitle}
                            </p>
                          )}
                          <Link
                            to={`/product/${item.id}`}
                            className="line-clamp-2 font-medium hover:underline"
                          >
                            {item.title}
                          </Link>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => {
                            remove(item);
                            toast.success("Removed from cart", {
                              description: item.title,
                            });
                          }}
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm tabular-nums text-muted-foreground">
                        {currency(item.price)} each
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                        <QuantityStepper
                          value={item.qty}
                          onChange={(qty) => changeQty(item, qty)}
                        />
                        <span className="text-lg font-semibold tabular-nums">
                          {currency(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}

            <div className="flex justify-end pt-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                    Clear cart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes every item. You can always add them again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep items</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.success("Cart cleared")}>
                      Clear cart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </ul>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="space-y-4 p-5">
                <h2 className="font-semibold">Order summary</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular-nums">{currency(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="tabular-nums">{currency(shipping)}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{currency(total)}</dd>
                  </div>
                </dl>
                <Button asChild className="w-full gap-2">
                  <Link to="/checkout">
                    Proceed to checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" />
                  Flat {currency(shipping)} shipping · confirmed on Telegram or WhatsApp
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}

      <RecentlyViewedSection />
    </div>
  );
}

export function RecentlyViewedSection() {
  const { products, loading } = useRecentlyViewedProducts();

  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-semibold">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}