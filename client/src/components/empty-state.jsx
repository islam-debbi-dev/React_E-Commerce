import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  actionLabel,
  actionTo,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center",
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </span>
      <div className="space-y-1">
        <h2 className="font-medium">{title}</h2>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actionLabel && (
        <Button asChild size="sm" className="mt-2">
          <Link to={actionTo || "/product"}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}