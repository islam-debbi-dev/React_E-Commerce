import { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type OverviewCardProps = {
  title: string;
  description?: string;
  cardIcon: LucideIcon;
  value: string;
  changePercent?: number | null;
  loading?: boolean;
};

export default function OverviewCard({
  title,
  description,
  cardIcon: CardIcon,
  value,
  changePercent,
  loading = false,
}: OverviewCardProps) {
  const hasChange = typeof changePercent === "number" && Number.isFinite(changePercent);
  const isUp = hasChange && (changePercent as number) >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <CardIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {hasChange && (
              <span
                className={`mb-0.5 flex items-center text-xs font-medium ${
                  isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(changePercent as number).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}