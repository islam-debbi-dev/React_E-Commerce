import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating_desc", label: "Highest rated" },
  { value: "rating_asc", label: "Lowest rated" },
];

export const RATING_OPTIONS = [
  { value: "0", label: "Any rating" },
  { value: "3", label: "3 stars & up" },
  { value: "3.5", label: "3.5 stars & up" },
  { value: "4", label: "4 stars & up" },
  { value: "4.5", label: "4.5 stars & up" },
];

const LIMITS = [12, 24, 48];

export default function FilterPanel({
  categories = [],
  category,
  minPrice,
  maxPrice,
  minRating,
  priceBounds,
  activeFilterCount,
  onChange,
  onClearAll,
  onClearFilter,
}) {
  const floor = Math.floor(priceBounds?.min ?? 0);
  const ceil = Math.ceil(priceBounds?.max ?? 1000);
  const rangeValue = [
    minPrice === "" ? floor : Number(minPrice),
    maxPrice === "" ? ceil : Number(maxPrice),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Filters</p>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Category
        </Label>
        <Select
          value={category || "all"}
          onValueChange={(value) => onChange({ category: value === "all" ? "" : value })}
        >
          <SelectTrigger className="w-full" aria-label="Category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {item.name} ({item.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Price
          </Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            ${rangeValue[0]} – ${rangeValue[1]}
          </span>
        </div>
        <Slider
          min={floor}
          max={ceil}
          step={1}
          value={rangeValue}
          onValueChange={([low, high]) =>
            onChange({
              minPrice: low <= floor ? "" : low,
              maxPrice: high >= ceil ? "" : high,
            })
          }
          aria-label="Price range"
        />
        <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>${floor}</span>
          <span>${ceil}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Rating
        </Label>
        <Select
          value={minRating || "0"}
          onValueChange={(value) => onChange({ minRating: value })}
        >
          <SelectTrigger className="w-full" aria-label="Minimum rating">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-1.5">
            {category && (
              <FilterChip
                label={categories.find((item) => item.slug === category)?.name ?? category}
                onClear={() => onClearFilter("category")}
              />
            )}
            {(minPrice || maxPrice) && (
              <FilterChip
                label={`$${rangeValue[0]} – $${rangeValue[1]}`}
                onClear={() => onChange({ minPrice: "", maxPrice: "" })}
              />
            )}
            {minRating && (
              <FilterChip
                label={`${minRating}+ stars`}
                onClear={() => onClearFilter("minRating")}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function LimitSelect({ limit, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-muted-foreground">Show</Label>
      <Select value={String(limit)} onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger className="h-8 w-[84px]" aria-label="Products per page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LIMITS.map((value) => (
            <SelectItem key={value} value={String(value)}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full p-0.5 transition-colors hover:bg-foreground/10"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}