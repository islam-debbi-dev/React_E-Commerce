"use client";

import { Skeleton } from "@/components/ui/skeleton";
import ErrorCard from "@/components/shared/error-card";
import OverviewCard from "@/components/overview/overview-card";
import SalesTrend from "@/components/overview/sales-trend";
import OrderStatusChart from "@/components/overview/order-status-chart";
import ChannelSplit from "@/components/overview/channel-split";
import TopProducts from "@/components/overview/top-products";
import RecentOrders from "@/components/overview/recent-orders";
import { Banknote, Package, ShoppingCart, Users } from "lucide-react";
import { useOverview } from "@/data/queries/analytics";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function PageClient() {
  const { data, isLoading, error } = useOverview(14);

  const isFirstLoad = isLoading && !data;

  if (isFirstLoad) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-md" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-[320px] w-full rounded-md" />
          <Skeleton className="h-[320px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (error) return <ErrorCard title="Error loading the shop overview" />;

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Revenue, orders and best sellers for the last{" "}
          {data?.revenue.windowDays ?? 14} days. Cancelled orders are excluded from revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Revenue"
          description="Excludes cancelled orders"
          cardIcon={Banknote}
          value={formatCurrency(data?.revenue.total ?? 0)}
          changePercent={data?.revenue.changePercent}
          loading={isLoading}
        />
        <OverviewCard
          title="Orders"
          description={`${formatNumber(data?.orders.pending ?? 0)} still pending`}
          cardIcon={ShoppingCart}
          value={formatNumber(data?.orders.total ?? 0)}
          loading={isLoading}
        />
        <OverviewCard
          title="Products"
          description={`in ${formatNumber(data?.products.categories ?? 0)} categories`}
          cardIcon={Package}
          value={formatNumber(data?.products.total ?? 0)}
          loading={isLoading}
        />
        <OverviewCard
          title="Customers"
          description="Unique phone numbers"
          cardIcon={Users}
          value={formatNumber(data?.customers.total ?? 0)}
          loading={isLoading}
        />
      </div>

      <SalesTrend
        data={data?.salesTrend ?? []}
        windowDays={data?.revenue.windowDays ?? 14}
        loading={isLoading}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OrderStatusChart
          orders={
            data?.orders ?? {
              total: 0,
              pending: 0,
              confirmed: 0,
              shipped: 0,
              delivered: 0,
              cancelled: 0,
            }
          }
          loading={isLoading}
        />
        <ChannelSplit
          channels={data?.channels ?? { telegram: 0, whatsapp: 0 }}
          loading={isLoading}
        />
        <TopProducts products={data?.topProducts ?? []} loading={isLoading} />
      </div>

      <RecentOrders orders={data?.recentOrders ?? []} loading={isLoading} />
    </div>
  );
}