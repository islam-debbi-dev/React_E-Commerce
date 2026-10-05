import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import ProductCard, { ProductCardSkeleton } from "@/components/product/product-card";
import EmptyState from "@/components/empty-state";
import { useStoredIds } from "@/hooks/use-stored-ids";
import { getProduct } from "@/api/products";

export default function Wishlist() {
  const wishlist = useStoredIds("wishlist");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wishlist.ids.length) {
      setProducts([]);
      return undefined;
    }

    let active = true;
    setLoading(true);

    Promise.all(wishlist.ids.map((id) => getProduct(id).catch(() => null)))
      .then((results) => {
        if (!active) return;
        setProducts(results.filter((product) => product?.product).map((res) => res.product));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [wishlist.ids]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
        <p className="text-sm text-muted-foreground">
          {wishlist.ids.length
            ? `${wishlist.ids.length} saved ${wishlist.ids.length === 1 ? "product" : "products"}`
            : "Products you save are kept in this browser"}
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any product to keep it here for later."
          actionLabel="Browse products"
          actionTo="/product"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}