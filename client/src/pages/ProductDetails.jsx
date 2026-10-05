import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Heart,
  PackageX,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import ProductCard, { ProductCardSkeleton } from "@/components/product/product-card";
import ProductGallery from "@/components/product/product-gallery";
import QuantityStepper from "@/components/product/quantity-stepper";
import RatingStars from "@/components/product/rating-stars";
import EmptyState from "@/components/empty-state";
import { useCart, currency } from "@/hooks/use-cart";
import { useCartDrawer } from "@/components/cart/cart-drawer-context";
import { useStoredIds } from "@/hooks/use-stored-ids";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { getProduct, getProductsByCategory } from "@/api/products";

const perks = [
  { icon: Truck, label: "Flat rate shipping" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Check, label: "Order confirmation on Telegram" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const wishlist = useStoredIds("wishlist");
  const { record } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setQty(1);

    getProduct(id)
      .then(async (data) => {
        if (!active) return;
        const item = data.product ?? data;
        setProduct(item);
        record(item.id);
        setLoading(false);

        if (item.category) {
          const related = await getProductsByCategory(item.category, 8).catch(() => null);
          if (active && related?.products) {
            setSimilar(related.products.filter((entry) => entry.id !== item.id).slice(0, 6));
          }
        }
      })
      .catch((error) => {
        if (!active) return;
        setLoading(false);
        setNotFound(true);
        toast.error(error.message);
      });

    return () => {
      active = false;
    };
  }, [id, record]);

  const maxQty = useMemo(() => Math.max(product?.stock ?? 10, 1), [product]);

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20">
        <EmptyState
          icon={PackageX}
          title="We could not find that product"
          description="It may have been removed from the shop. Browse the catalogue to find something similar."
          actionLabel="Back to shop"
          actionTo="/product"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
        <Separator className="my-12" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!product) return null;

  const { title, description, price, image, brand, categoryTitle, images } = product;
  const rating = product?.rating?.rate ?? 0;
  const wished = wishlist.has(product.id);
  const inStock = (product.stock ?? 0) > 0;

  const addToCart = () => {
    cart.add(product, qty);
    toast.success(`Added ${qty} × ${title}`, {
      action: { label: "View cart", onClick: openDrawer },
    });
    setQty(1);
  };

  const buyNow = () => {
    cart.add(product, qty);
    toast.success("Added to cart, taking you to checkout");
    setQty(1);
    navigate("/checkout");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/product">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery image={image} images={images} alt={title} badge={
          !inStock ? <Badge variant="secondary">Sold out</Badge> : null
        } />

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            {categoryTitle && (
              <Link
                to={`/product?category=${encodeURIComponent(product.category ?? "")}`}
                className="text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                {categoryTitle}
              </Link>
            )}
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <RatingStars value={rating} count={product?.rating?.count} showValue />
              {brand && <span className="text-sm text-muted-foreground">by {brand}</span>}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold tabular-nums">{currency(price)}</span>
            {product.discountPercentage > 0 && (
              <Badge variant="secondary" className="tabular-nums">
                {currency(price / (1 - product.discountPercentage / 100))}
              </Badge>
            )}
          </div>

          <p className="leading-relaxed text-muted-foreground">{description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
            <span className="text-sm text-muted-foreground">
              {currency(price * qty)}
            </span>
            {inStock && (
              <Badge variant="outline" className="tabular-nums">
                {product.stock} in stock
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={addToCart}
              disabled={!inStock}
              className="min-w-40 flex-1 gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </Button>
            <Button
              variant="outline"
              onClick={buyNow}
              disabled={!inStock}
              className="min-w-32 flex-1"
            >
              Buy now
            </Button>
            <Button
              size="icon"
              variant={wished ? "secondary" : "outline"}
              className="h-10 w-10"
              onClick={() => {
                wishlist.toggle(product.id);
                toast.success(wished ? "Removed from wishlist" : "Saved to wishlist", {
                  description: title,
                });
              }}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
            </Button>
          </div>

          <Card className="mt-2">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </div>
              ))}
            </CardContent>
          </Card>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between border-b py-2 sm:justify-start sm:gap-3">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium capitalize">{product.category}</dd>
            </div>
            <div className="flex justify-between border-b py-2 sm:justify-start sm:gap-3">
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="font-medium">{product.sku || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-lg font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
