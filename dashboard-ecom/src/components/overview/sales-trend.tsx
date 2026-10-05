"use client";

import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
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
import type { SalesTrendPoint } from "@/types/analytics";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDayLabel,
} from "@/lib/format";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type SalesTrendProps = {
  data: SalesTrendPoint[];
  windowDays: number;
  loading?: boolean;
};

export default function SalesTrend({
  data,
  windowDays,
  loading = false,
}: SalesTrendProps) {
  const chartData = data.map((point) => ({
    ...point,
    day: formatDayLabel(point.date),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales trend</CardTitle>
        <CardDescription>
          Revenue and orders for the last {windowDays} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[260px] w-full animate-pulse rounded-md bg-muted" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No orders yet. Sales appear here as soon as the shop takes an order.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <ComposedChart data={chartData} margin={{ left: 4, right: 4, top: 8 }}>
              <defs>
                <linearGradient id="fill-revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                yAxisId="revenue"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                tickFormatter={(value: number) => formatCompactCurrency(value)}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={28}
                allowDecimals={false}
              />
              <ChartTooltip
                content={(props) => (
                  <ChartTooltipContent
                    {...props}
                    indicator="line"
                    formatter={(value, name) =>
                      name === "revenue"
                        ? formatCurrency(Number(value))
                        : `${value} orders`
                    }
                  />
                )}
              />
              <Area
                yAxisId="revenue"
                dataKey="revenue"
                type="natural"
                stroke="var(--color-revenue)"
                fill="url(#fill-revenue)"
                strokeWidth={2}
              />
              <Line
                yAxisId="orders"
                dataKey="orders"
                type="monotone"
                stroke="var(--color-orders)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}