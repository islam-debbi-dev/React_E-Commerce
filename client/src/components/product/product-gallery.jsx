import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProductGallery({ image, images = [], alt, badge }) {
  const gallery = [...new Set([image, ...images].filter(Boolean))];
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [image]);

  const active = gallery[index] ?? image;
  const move = (delta) =>
    setIndex((current) => (current + delta + gallery.length) % gallery.length);

  if (!active) {
    return <div className="aspect-square rounded-lg bg-muted" />;
  }

  return (
    <div className="space-y-3">
      <div className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
        <img
          src={active}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge && <div className="absolute left-3 top-3">{badge}</div>}

        {gallery.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={() => move(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={() => move(1)}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => setZoom(true)}
          aria-label="View larger image"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, thumbIndex) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(thumbIndex)}
              aria-label={`View image ${thumbIndex + 1}`}
              aria-current={thumbIndex === index}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors",
                thumbIndex === index ? "border-foreground" : "border-transparent hover:border-muted-foreground/40"
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoom(false)}
        >
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setZoom(false)}
            aria-label="Close"
          >
            <ChevronRight className="h-5 w-5 rotate-45" />
          </Button>
          <img
            src={active}
            alt={alt}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}