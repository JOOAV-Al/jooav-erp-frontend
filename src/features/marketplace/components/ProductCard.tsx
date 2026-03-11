"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { cn } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  currency?: string;
  size?: string;
  type?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: 1,
        size: product.size,
        type: product.type,
        currency: product.currency ?? "NGN",
      })
    );
  };

  return (
    <Link
      href={`/dashboard/marketplace/product/${product.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl bg-storey-foreground",
        "border border-transparent hover:border-border-main transition-all duration-200",
        "overflow-hidden cursor-pointer",
        className
      )}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-200"
        />

        {/* Cart icon — appears on hover */}
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className={cn(
            "absolute bottom-2 right-2 z-10",
            "h-8 w-8 rounded-full bg-white shadow-card",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100",
            "translate-y-2 group-hover:translate-y-0",
            "transition-all duration-200",
            "hover:bg-primary hover:text-white"
          )}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Info */}
      <div className="px-4 pt-2 pb-4 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-body leading-snug line-clamp-2">
          {product.name}
        </p>
        {product.variant && (
          <p className="text-xs text-body-passive font-medium">{product.variant}</p>
        )}
        <p className="text-sm font-bold text-heading mt-1">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
