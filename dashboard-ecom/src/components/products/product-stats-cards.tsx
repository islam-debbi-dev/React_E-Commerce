import { AlertTriangle, Boxes, PackageX, Wallet } from "lucide-react";
import OverviewCard from "@/components/overview/overview-card";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProductTotals } from "@/types/product";

type ProductStatsCardsProps = {
  totals?: ProductTotals;
  lowStockThreshold: number;
  loading?: boolean;
};

export default function ProductStatsCards({
  totals,
  lowStockThreshold,
  loading = false,
}: ProductStatsCardsProps) {
  const inStock = totals ? totals.inStock - totals.lowStock : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <OverviewCard
        title="Catalogue"
        description={`${formatNumber(totals?.categories ?? 0)} categories`}
        cardIcon={Boxes}
        value={formatNumber(totals?.total ?? 0)}
        loading={loading}
      />
      <OverviewCard
        title="Inventory value"
        description={`${formatNumber(totals?.units ?? 0)} units on hand`}
        cardIcon={Wallet}
        value={formatCurrency(totals?.inventoryValue ?? 0, 0)}
        loading={loading}
      />
      <OverviewCard
        title="In stock"
        description={`Avg. price ${formatCurrency(totals?.averagePrice ?? 0)}`}
        cardIcon={Boxes}
        value={formatNumber(inStock)}
        loading={loading}
      />
      <OverviewCard
        title="Needs attention"
        description={`${formatNumber(totals?.outOfStock ?? 0)} out · ${formatNumber(totals?.lowStock ?? 0)} low (≤${lowStockThreshold})`}
        cardIcon={totals?.outOfStock ? AlertTriangle : PackageX}
        value={formatNumber((totals?.outOfStock ?? 0) + (totals?.lowStock ?? 0))}
        loading={loading}
      />
    </div>
  );
}