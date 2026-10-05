import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export default function ResponsiveImage({
  src,
  alt,
  size,
  width,
  height,
  aspectRatio,
}: {
  src: string;
  alt?: string;
  size: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}) {
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);

  console.log(
    "width: ",
    width,
    " height: ",
    height,
    " aspectRatio: ",
    aspectRatio,
  );

  return (
    <div
      className={`relative  ${
        width && height ? `w-${width} h-${height}` : `aspect-[${aspectRatio}]`
      }`}
    >
      <picture className=" w-full h-full">
        <source srcSet={`${src}?format=avif&size=${size}`} type="image/avif" />
        <source srcSet={`${src}?format=webp&size=${size}`} type="image/webp" />
        <img
          ref={imgRef}
          src={`${src}?size=${size}`}
          alt={alt || ""}
          className={cn(
            "object-cover w-full h-full transition-all rounded-md duration-300 group-hover:scale-105 group-hover:brightness-90",
            loading ? "opacity-0" : "opacity-100",
          )}
          onLoad={() => setLoading(false)}
          loading="lazy"
        />
      </picture>
    </div>
  );
}
