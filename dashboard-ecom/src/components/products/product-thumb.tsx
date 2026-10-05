import { isRenderableImage } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductThumbProps = {
  src?: string;
  alt: string;
  className?: string;
};

/**
 * Cloudinary URLs are already optimised, so a plain img keeps the dashboard
 * independent of the image CDN instead of hardcoding transformations.
 */
export default function ProductThumb({ src, alt, className }: ProductThumbProps) {
  if (!isRenderableImage(src)) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-muted text-xs font-medium uppercase text-muted-foreground",
          className,
        )}
        aria-hidden
      >
        {alt.slice(0, 1) || "?"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("shrink-0 bg-muted object-cover", className)}
    />
  );
}