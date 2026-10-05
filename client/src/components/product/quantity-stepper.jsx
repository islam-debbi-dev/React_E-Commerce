import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function QuantityStepper({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  size = "default",
  className,
}) {
  const clamp = (next) => Math.min(Math.max(next, min), max);
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-background p-1",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={buttonSize}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </Button>
      <span
        className={cn(
          "min-w-8 text-center text-sm font-medium tabular-nums",
          size === "sm" && "min-w-6 text-xs"
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={buttonSize}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
}