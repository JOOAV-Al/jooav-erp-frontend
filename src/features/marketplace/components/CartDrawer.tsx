"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart } from "@/redux/slices/cartSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import CartItem from "./CartItem";
import { useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>("");
  const items = useSelector((state: RootState) => state.cart.items);

  const handleCheckout = () => {
    onOpenChange(false);
    router.push("/dashboard/marketplace/checkout");
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 w-full sm:max-w-sm"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border-main">
          <SheetTitle className="text-base font-semibold text-heading">
            Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <ScrollArea className="flex-1 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-sm text-body-passive">Your cart is empty.</p>
              <p className="text-xs text-body-passive mt-1">
                Add products to get started.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer CTAs */}
        <div className="px-6 py-5 border-t border-border-main flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Continue shopping
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
