import { Link } from "react-router-dom";
import {
  Check,
  Copy,
  MessageCircle,
  Package,
  Send,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { currency } from "@/hooks/use-cart";

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export default function SuccessPanel({ result, copied, onCopy }) {
  const { order, whatsappUrl, channel, tabBlocked } = result ?? {};
  if (!order) return null;

  const number = order.orderNumber ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Order placed</h1>
          <p className="text-sm text-muted-foreground">
            Thanks {order.customer?.name?.split(" ")[0] ?? "for your order"}. We sent the
            summary to the shop and will confirm delivery with you.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          {channel === "whatsapp" ? (
            <MessageCircle className="h-3 w-3" />
          ) : (
            <Send className="h-3 w-3" />
          )}
          {channel === "whatsapp" ? "WhatsApp" : "Telegram"}
        </Badge>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted/60 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Order number
              </p>
              <p className="font-mono text-lg font-semibold">{number}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={async () => {
                const ok = await copyToClipboard(number);
                if (ok) {
                  onCopy(true);
                  toast.success("Order number copied");
                  setTimeout(() => onCopy(false), 2000);
                } else {
                  toast.error("Copy failed, select the number manually");
                }
              }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">
              Items ({order.itemCount ?? order.items?.length ?? 0})
            </p>
            <ul className="space-y-3">
              {(order.items ?? []).map((item) => (
                <li key={item.productId ?? item.id} className="flex gap-3">
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {item.qty} × {currency(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {currency(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{currency(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="tabular-nums">{currency(order.shipping)}</dd>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{currency(order.total)}</dd>
            </div>
          </dl>

          {order.customer?.phone && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              Delivery updates go to {order.customer.phone}
            </p>
          )}

          {channel === "whatsapp" && tabBlocked && whatsappUrl && (
            <div className="rounded-md border border-dashed p-3 text-sm">
              <p className="mb-2 text-muted-foreground">
                Your browser blocked the WhatsApp tab. Use the link to finish sending your
                order:
              </p>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Open WhatsApp
                </a>
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild className="gap-2">
              <Link to="/product">
                <Package className="h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}