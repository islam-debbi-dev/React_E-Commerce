import Image from "next/image";
import { MessageCircle, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency, formatRelativeTime, isRenderableImage } from "@/lib/format";

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  confirmed: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

type RecentOrdersProps = {
  orders: Order[];
  loading?: boolean;
};

export default function RecentOrders({
  orders,
  loading = false,
}: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>The 6 latest orders</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {loading ? (
          <div className="space-y-3 px-6">
            {[1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="px-6 text-sm text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-2 font-medium">Order</th>
                  <th className="px-4 py-2 font-medium">Customer</th>
                  <th className="px-4 py-2 font-medium">Channel</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Total</th>
                  <th className="px-6 py-2 text-right font-medium">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="px-6 py-3 font-medium tabular-nums">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isRenderableImage(order.items[0]?.image) ? (
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded bg-muted">
                            <Image
                              src={order.items[0].image}
                              alt={order.items[0].title}
                              fill
                              sizes="28px"
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <p className="truncate font-medium">{order.customer.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        {order.channel === "whatsapp" ? (
                          <MessageCircle className="h-3.5 w-3.5" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        {order.channel === "whatsapp" ? "WhatsApp" : "Telegram"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status]} className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-muted-foreground tabular-nums">
                      {formatRelativeTime(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}