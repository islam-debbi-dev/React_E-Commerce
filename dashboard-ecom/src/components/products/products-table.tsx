import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductThumb from "@/components/products/product-thumb";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import type { Product } from "@/types/product";

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000";

type StockBadgeProps = {
  stock: number;
  lowStockThreshold: number;
};

export function StockBadge({ stock, lowStockThreshold }: StockBadgeProps) {
  if (stock <= 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400">
        Low · {stock}
      </Badge>
    );
  }

  return <Badge variant="secondary">{stock} in stock</Badge>;
}

type ProductsTableProps = {
  products: Product[];
  loading?: boolean;
  lowStockThreshold: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductsTable({
  products,
  loading = false,
  lowStockThreshold,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (loading && products.length === 0) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3, 4, 5].map((row) => (
          <Skeleton key={row} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={loading ? "opacity-60 transition-opacity" : undefined}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[260px]">Product</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Rating</TableHead>
            <TableHead className="hidden xl:table-cell text-right">Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ProductThumb
                    src={product.image}
                    alt={product.title}
                    className="h-10 w-10 rounded-md"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[product.brand, product.sku].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {product.categoryTitle}
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium tabular-nums">{formatCurrency(product.price)}</span>
                {product.discountPercentage > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground line-through tabular-nums">
                    {formatCurrency(
                      product.price / (1 - product.discountPercentage / 100),
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <StockBadge stock={product.stock} lowStockThreshold={lowStockThreshold} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right tabular-nums text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {product.rating.rate || "—"}
                </span>
              </TableCell>
              <TableCell className="hidden xl:table-cell text-right text-xs text-muted-foreground tabular-nums">
                {formatRelativeTime(product.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    aria-label={`Open ${product.title} in the storefront`}
                  >
                    <a
                      href={`${STOREFRONT_URL}/product/${product.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${product.title}`}
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Delete ${product.title}`}
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}