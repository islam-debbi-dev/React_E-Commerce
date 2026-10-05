"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { OrderStatusSummary } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

const STATUS_ORDER: (keyof Omit<OrderStatusSummary, "total">)[] = [
  "delivered",
  "shipped",
  "confirmed",
  "pending",
  "cancelled",
];

const chartConfig = {
  delivered: { label: "Delivered", color: "var(--chart-5)" },
  shipped: { label: "Shipped", color: "var(--chart-3)" },
  confirmed: { label: "Confirmed", color: "var(--chart-2)" },
  pending: { label: "Pending", color: "var(--chart-1)" },
  cancelled: { label: "Cancelled", color: "var(--destructive)" },
} satisfies ChartConfig;

type OrderStatusChartProps = {
  orders: OrderStatusSummary;
  loading?: boolean;
};

export default function OrderStatusChart({
  orders,
  loading = false,
}: OrderStatusChartProps) {
  const chartData = STATUS_ORDER.map((status) => ({
    status,
    label: chartConfig[status].label,
    fill: chartConfig[status].color,
    value: orders[status],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by status</CardTitle>
        <CardDescription>{formatNumber(total)} orders in total</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[220px] w-full animate-pulse rounded-md bg-muted" />
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[220px]"
            >
              <PieChart>
                <ChartTooltip
                  content={(props) => (
                    <ChartTooltipContent
                      {...props}
                      nameKey="label"
                      hideLabel
                      formatter={(value) => `${value} orders`}
                    />
                  )}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={58}
                  strokeWidth={0}
                >
                  {chartData.map((item) => (
                    <Cell key={item.status} fill={item.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {chartData.map((item) => (
                <div key={item.status} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(--color-${item.status})` }}
                    />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}