"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/mutations/product-mutations";
import type { ActionResponseType } from "@/types/actions-response";
import type { Product } from "@/types/product";

type DeleteProductDialogProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (result: ActionResponseType) => void;
};

export default function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onDeleted,
}: DeleteProductDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!product) return;

    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      onDeleted(result);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this product?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{product?.title}&quot; will be removed from the storefront and from your
            catalogue. Orders that already contain it are not affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep it</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete product
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}