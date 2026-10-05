import Image from "next/image";
import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TopProduct } from "@/types/analytics";
import { formatCurrency, formatNumber, isRenderableImage } from "@/lib/format";

type TopProductsProps = {
  products: TopProduct[];
  loading?: boolean;
};

export default function TopProducts({
  products,
  loading = false,
}: TopProductsProps) {
  const maxUnits = Math.max(...products.map((item) => item.units), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best sellers</CardTitle>
        <CardDescription>Top 5 products by units sold</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No products sold yet.
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.productId} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  {isRenderableImage(product.image) ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      <span className="mr-1.5 text-muted-foreground tabular-nums">
                        {index + 1}.
                      </span>
                      {product.title}
                    </p>
                    <p className="shrink-0 text-sm font-medium tabular-nums">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{
                          width: `${Math.round((product.units / maxUnits) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                      {formatNumber(product.units)} sold
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}