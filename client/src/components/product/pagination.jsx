import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Compact page window: 1 … 4 5 [6] 7 8 … 20 */
const windowPages = (page, totalPages, span = 1) => {
  const pages = new Set([1, totalPages]);
  for (let i = page - span; i <= page + span; i += 1) {
    if (i > 1 && i < totalPages) pages.add(i);
  }
  return [...pages].sort((a, b) => a - b);
};

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = windowPages(page, totalPages);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((value, index) => {
        const previous = pages[index - 1];
        return (
          <span key={value} className="flex items-center gap-1">
            {previous && value - previous > 1 && (
              <span className="px-1 text-sm text-muted-foreground">…</span>
            )}
            <Button
              variant={value === page ? "default" : "outline"}
              size="icon"
              className={cn("h-8 w-8 text-sm tabular-nums")}
              onClick={() => onPageChange(value)}
              aria-label={`Page ${value}`}
              aria-current={value === page ? "page" : undefined}
            >
              {value}
            </Button>
          </span>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}