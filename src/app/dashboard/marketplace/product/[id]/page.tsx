"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ShoppingCart, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { useFetchProduct } from "@/features/marketplace/services/marketplace.api";
import { Button } from "@/components/ui/button";
import ProductDetailSkeleton from "@/features/marketplace/components/ProductDetailSkeleton";

function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { data: response, isLoading } = useFetchProduct(id);

  // Support both { data: Product } and plain Product shapes
  const product = response?.data ?? response;

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p>Product not found.</p>
        <Link
          href="/dashboard/marketplace"
          className="text-primary text-sm mt-2 inline-block"
        >
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const images: string[] = product.images?.length
    ? product.images
    : [product.thumbnail];
  const price = Number(product.price);
  const discountedPrice =
    product.discount && Number(product.discount) > 0
      ? price * (1 - Number(product.discount) / 100)
      : price;

  // Collect non-empty meta tags
  const metaTags = [
    product.brand?.name,
    product.variant?.name,
    product.packSize?.name,
    product.packType?.name,
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        image: product.thumbnail || images[0],
        price: discountedPrice,
        qty,
        size: product.packSize?.name,
        type: product.packType?.name,
        currency: "NGN",
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back — plain text link, no border */}
      <Link
        href="/dashboard/marketplace"
        className="inline-flex items-center gap-0.5 text-sm text-body-passive hover:text-body mb-8 transition-colors border-0 shadow-none bg-transparent p-0 outline-none"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* ── LEFT: image gallery ───────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div className="relative aspect-square w-full rounded-2xl bg-storey-foreground overflow-hidden border border-gray-200">
            <Image
              src={images[activeImage] ?? ""}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
          </div>

          {/* Thumbnails — always show, highlight active */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all duration-150 bg-storey-foreground ${
                  i === activeImage
                    ? "border-primary"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: product info ───────────────────────────── */}
        <div className="flex flex-col">
          {/* Product name */}
          <h1 className="text-2xl font-bold text-heading leading-snug mb-3">
            {product.name}
          </h1>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-body-passive leading-relaxed mb-4">
              {product.description}
            </p>
          )}

          {/* Meta tags — only render when at least one exists */}
          {metaTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {metaTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-storey-foreground border border-gray-200 text-xs text-body font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-6">
            <span className="text-sm font-semibold text-body">Quantity</span>
            <input
              type="number"
              min={1}
              max={product.quantity ?? 999}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 text-right text-sm font-semibold text-body bg-transparent outline-none focus:outline-none border-none
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Price */}
          <div className="mb-5">
            <p className="text-2xl font-bold text-heading">
              {formatPrice(discountedPrice * qty)}
            </p>
            {Number(product.discount) > 0 && (
              <p className="text-sm text-body-passive line-through mt-0.5">
                {formatPrice(price * qty)}
              </p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 mb-5">
            <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" strokeWidth={2} />
              Buy now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={2} />
              Add to cart
            </Button>
          </div>

          {/* Legal — inside a storey-foreground card (matches Figma) */}
          <div className="rounded-xl bg-storey-foreground border border-gray-200 px-4 py-3">
            <p className="text-xs text-body-passive leading-relaxed">
              By using{" "}
              <Link href="/" className="font-semibold underline">
                jooav.com
              </Link>
              , you agree to our{" "}
              <Link href="/terms" className="font-semibold underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="font-semibold underline">
                Condition of use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
