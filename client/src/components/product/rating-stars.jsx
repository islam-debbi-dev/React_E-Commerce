import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";

export default function RatingStars({ value = 0, count, className, showValue = false }) {
  const rating = Number(value) || 0;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = rating >= index + 1;
          const half = !filled && rating > index + 0.25;
          return half ? (
            <StarHalf key={index} className="h-3.5 w-3.5 fill-primary text-primary" />
          ) : (
            <Star
              key={index}
              className={cn(
                "h-3.5 w-3.5",
                filled ? "fill-primary text-primary" : "text-muted-foreground/40"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs tabular-nums text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
    </div>
  );
}