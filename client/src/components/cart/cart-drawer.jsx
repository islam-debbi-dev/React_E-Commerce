import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart, currency } from "@/hooks/use-cart";
import { useCartDrawer } from "@/components/cart/cart-drawer-context";
import QuantityStepper from "@/components/product/quantity-stepper";

export default function CartDrawer() {
  const { open, closeDrawer } = useCartDrawer();
  const { items, itemCount, subtotal, shipping, total, changeQty, remove, isEmpty } = useCart();

  return (
    <Sheet open={open} onOpenChange={(next) => (next ? null : closeDrawer())}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Your cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>Review your items before checking out.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </span>
              <div>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Browse the shop and add something you like.
                </p>
              </div>
              <Button asChild size="sm" className="mt-2">
                <Link to="/product" onClick={closeDrawer}>
                  Start shopping
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <Link
                    to={`/product/${item.id}`}
                    onClick={closeDrawer}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={closeDrawer}
                      className="line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {currency(item.price)} each
                    </span>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <QuantityStepper
                        size="sm"
                        value={item.qty}
                        onChange={(qty) => changeQty(item, qty)}
                      />
                      <span className="text-sm font-semibold tabular-nums">
                        {currency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 self-start"
                    onClick={() => {
                      remove(item);
                      toast.success("Removed from cart", { description: item.title });
                    }}
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <SheetFooter className="mt-auto flex-col gap-3 border-t p-4">
            <dl className="w-full space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">{currency(shipping)}</dd>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{currency(total)}</dd>
              </div>
            </dl>
            <Button asChild className="w-full gap-2">
              <Link to="/checkout" onClick={closeDrawer}>
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/cart" onClick={closeDrawer}>
                View full cart
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}