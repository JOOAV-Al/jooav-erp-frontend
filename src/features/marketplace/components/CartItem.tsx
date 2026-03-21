"use client";

import AppImage from "@/components/general/AppImage";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartItemType {
  id: string;
  productId: string;
  name: string;
  image: string;
  qty: number;
  size?: string;
  type?: string;
  price: number;
  currency?: string;
}

interface CartItemProps {
  item: CartItemType;
  onRemove?: (id: string) => void;
  className?: string;
}

function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function CartItem({ item, onRemove, className }: CartItemProps) {
  return (
    <div className={cn("flex items-start gap-3 py-3 border-b border-border-main last:border-0", className)}>
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-storey-foreground">
        <AppImage
          src={item.image}
          alt={item.name}
          fill
          className="object-contain p-1"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-body leading-snug line-clamp-1">
            {item.name}
          </p>
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Meta grid — matches Figma: QTY · SIZE / TYPE · PRICE */}
        <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          <p className="text-body-passive">
            <span className="font-semibold text-body">QTY:</span>{" "}
            <span className="font-medium">{item.qty}</span>
          </p>
          {item.size && (
            <p className="text-body-passive text-right">
              <span className="font-semibold text-body">SIZE:</span>{" "}
              <span className="font-medium">{item.size}</span>
            </p>
          )}
          {item.type && (
            <p className="text-body-passive">
              <span className="font-semibold text-body">TYPE:</span>{" "}
              <span className="font-medium">{item.type}</span>
            </p>
          )}
          <p className="text-body-passive text-right">
            <span className="font-semibold text-body">PRICE:</span>{" "}
            <span className="font-semibold text-heading">
              {formatPrice(item.price, item.currency)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
