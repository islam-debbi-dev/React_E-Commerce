"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProductThumb from "@/components/products/product-thumb";
import {
  createProductAction,
  updateProductAction,
} from "@/mutations/product-mutations";
import type { ActionResponseType } from "@/types/actions-response";
import type { Category, Product } from "@/types/product";

const NO_CATEGORY = "__none__";

const schema = z.object({
  title: z.string().trim().min(3, "Use at least 3 characters"),
  description: z.string().trim().max(2000, "Keep it under 2000 characters"),
  category: z.string().min(1, "Pick a category"),
  brand: z.string().trim().max(120, "Keep it under 120 characters"),
  sku: z.string().trim().max(60, "Keep it under 60 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  discountPercentage: z.coerce.number().min(0).max(99, "Use a value from 0 to 99"),
  stock: z.coerce.number().int("Whole units only").min(0, "Stock cannot be negative"),
  rate: z.coerce.number().min(0).max(5, "Rate from 0 to 5"),
  count: z.coerce.number().int("Whole reviews only").min(0, "Whole units only"),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https?:\/\/.+/.test(value),
      "Start the URL with https://",
    ),
});

type FormValues = z.infer<typeof schema>;

const toFormValues = (product: Product | null): FormValues => ({
  title: product?.title ?? "",
  description: product?.description ?? "",
  category: product?.category ?? NO_CATEGORY,
  brand: product?.brand ?? "",
  sku: product?.sku ?? "",
  price: product?.price ?? 0,
  discountPercentage: product?.discountPercentage ?? 0,
  stock: product?.stock ?? 0,
  rate: product?.rating.rate ?? 0,
  count: product?.rating.count ?? 0,
  imageUrl: "",
});

const toFormData = (values: FormValues, image: File | null, productId?: string) => {
  const formData = new FormData();

  if (productId) formData.append("productId", productId);

  Object.entries(values).forEach(([key, value]) => {
    if (key === "imageUrl" && value === "") return;
    formData.append(key, String(value));
  });

  if (image) formData.append("image", image, image.name);

  return formData;
};

type ProductFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  onSaved: (result: ActionResponseType) => void;
};

export default function ProductFormSheet({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: ProductFormSheetProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditingProduct = Boolean(product);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(product),
    mode: "onBlur",
  });

  useEffect(() => {
    reset(toFormValues(product));
    setImage(null);
    setPreview("");
  }, [product, reset]);

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = handleSubmit((values) => {
    if (!isEditingProduct && !image && !values.imageUrl) {
      setError("imageUrl", {
        message: "Upload an image or paste an image URL",
      });
      return;
    }

    startTransition(async () => {
      const result = isEditingProduct
        ? await updateProductAction(null, toFormData(values, image, product?.id))
        : await createProductAction(null, toFormData(values, image));

      if (result.success) {
        clearImage();
        reset(toFormValues(product));
      }

      onSaved(result);
    });
  });

  const previewSrc = preview || watch("imageUrl") || product?.image;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{isEditingProduct ? "Edit product" : "Add product"}</SheetTitle>
          <SheetDescription>
            {isEditingProduct
              ? "Changes go live in the storefront immediately."
              : "New products appear in the storefront as soon as they are saved."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5 px-4 pb-4">
          <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2" disabled={isPending}>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Aurora Wireless Headphones"
                aria-invalid={Boolean(errors.title)}
                {...register("title")}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category") || NO_CATEGORY}
                onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
              >
                <SelectTrigger id="category" aria-invalid={Boolean(errors.category)}>
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.category?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="Sony"
                aria-invalid={Boolean(errors.brand)}
                {...register("brand")}
              />
              <FieldError message={errors.brand?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={Boolean(errors.price)}
                {...register("price")}
              />
              <FieldError message={errors.price?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount %</Label>
              <Input
                id="discountPercentage"
                type="number"
                min={0}
                max={99}
                aria-invalid={Boolean(errors.discountPercentage)}
                {...register("discountPercentage")}
              />
              <FieldError message={errors.discountPercentage?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                step={1}
                aria-invalid={Boolean(errors.stock)}
                {...register("stock")}
              />
              <FieldError message={errors.stock?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="AUR-001"
                aria-invalid={Boolean(errors.sku)}
                {...register("sku")}
              />
              <FieldError message={errors.sku?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Rating</Label>
              <Input
                id="rate"
                type="number"
                min={0}
                max={5}
                step="0.1"
                aria-invalid={Boolean(errors.rate)}
                {...register("rate")}
              />
              <FieldError message={errors.rate?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Rating count</Label>
              <Input
                id="count"
                type="number"
                min={0}
                step={1}
                aria-invalid={Boolean(errors.count)}
                {...register("count")}
              />
              <FieldError message={errors.count?.message} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="What makes this product worth buying?"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </fieldset>

          <fieldset className="space-y-3" disabled={isPending}>
            <Label htmlFor="image">Image</Label>
            <div className="flex items-start gap-4">
              <ProductThumb
                src={previewSrc}
                alt={watch("title") || "New product"}
                className="h-20 w-20 rounded-md text-base"
              />
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setImage(file);
                    if (file) {
                      setValue("imageUrl", "");
                      setPreview("");
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP or AVIF up to 8 MB. Uploads replace the current photo.
                </p>
                {image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                    Remove upload
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">or paste an image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://res.cloudinary.com/…"
                aria-invalid={Boolean(errors.imageUrl)}
                {...register("imageUrl")}
                onChange={(event) => {
                  setValue("imageUrl", event.target.value, { shouldValidate: true });
                  if (event.target.value) {
                    clearImage();
                    setPreview("");
                  }
                }}
              />
              <FieldError message={errors.imageUrl?.message} />
            </div>
          </fieldset>

          <SheetFooter className="mt-auto flex-row items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  {isEditingProduct ? "Save changes" : "Add product"}
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <span aria-live="polite" className="block min-h-4 text-xs text-destructive">
      {message}
    </span>
  );
}