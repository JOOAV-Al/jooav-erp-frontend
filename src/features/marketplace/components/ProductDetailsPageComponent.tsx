"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  useCreateDraftOrder,
  useFetchProduct,
  useGetOrderDetails,
  useInitiateOrderPayment,
  useReInitiateOrderPayment,
  useUpdateDraftOrder,
} from "@/features/marketplace/services/marketplace.api";
import { Button } from "@/components/ui/button";
import ProductDetailSkeleton from "@/features/marketplace/components/ProductDetailSkeleton";
import { RootState } from "@/redux/store";
import { CreateOrderPayload, Product } from "@/features/marketplace/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function ProductDetailPageComponent() {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const draftCart = auth.cartDraftNumber;

  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { data } = useGetOrderDetails({ orderNumber: draftCart ?? "" });
  const { data: response, isLoading, refetch } = useFetchProduct(id);
  // Support both { data: Product } and plain Product shapes
  const product = response?.data ?? response;
  const userDraftCart = data?.data;

  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(
    userDraftCart?.items?.find((i) => i?.product?.id === product?.id)
      ?.quantity ?? 10,
  );
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, []);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <h3>Product not found.</h3>
        <Link
          href="/dashboard/marketplace"
          className="inline-flex items-center h-8.5 font-medium text-[15px] leading-[1.2] tracking-[0.04em] text-body hover:text-primary mb-8 transition-colors border border-border-main table-tag bg-storey-foreground p-md rounded-md outline-none"
        >
          Back to marketplace
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

  const handleAddToCart = async (item: Product, action: string) => {
    //If authenticated, save cart as draft and update
    const itemToSave = {
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.thumbnail || images[0],
      price: discountedPrice,
      qty,
      size: product.packSize?.name,
      type: product.packType?.name,
      currency: "NGN",
    };
    if (isAuthenticated) {
      const existingItem = userDraftCart?.items?.find(
        (i) => i?.product?.id === item?.id,
      );
      if (existingItem && action === "ADD") {
        toast("Product already in cart");
        return;
      }

      const payload: CreateOrderPayload = {
        item: {
          action,
          productId: item?.id,
          quantity: qty,
          ...(action === "UPDATE"
            ? {
                itemId: existingItem?.id,
              }
            : {}),
        },
      };

      // "add" or "update" — PATCH /orders/:id
      const res = await updateDraftOrder({
        payload,
        id: user?.wholesalerProfile?.draftCart ?? "",
      });
      if (res.data.status === "success") {
        if (action === "ADD") {
          dispatch(addToCart(itemToSave));
        }
        refetch();
      }
    } else {
      // Else, save to local storage then retrieve and save as draft after login
      localStorage.setItem("tempCartItem", JSON.stringify(itemToSave));
      router.push("/login?fromCart=true");
    }
  };

  // const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setQty(Math.max(1, Number(e.target.value)));
  //   const itemExists = userDraftCart?.items?.some(
  //     (i) => i?.product?.id === product?.id,
  //   );
  //   //TODO: Wire a debounce to wait for the user to stop inputting then decide to call endpoint

  //   if (itemExists) {
  //     handleAddToCart(product, "UPDATE");
  //   }
  // };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextQty = Math.max(1, Number(e.target.value) || 1);
    setQty(nextQty);

    if (!draftCart || !userDraftCart || !product?.id) return;

    // Keep UI responsive; only update after typing stops
    if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    updateTimerRef.current = setTimeout(async () => {
      const existing = userDraftCart.items?.find(
        (i) => i?.product?.id === product?.id,
      );
      if (!existing) return;

      const payload: CreateOrderPayload = {
        item: {
          action: "UPDATE",
          productId: product.id,
          itemId: existing.id,
          quantity: nextQty,
        },
      };

      try {
        await updateDraftOrder({
          payload,
          id: user?.wholesalerProfile?.draftCart ?? draftCart,
        });
        refetch();
      } catch (err) {
        toast.error("Could not update cart quantity.");
      }
    }, 450);
  };

  const handleBuyNow = async () => {
    if (!product || !qty) return;
    const itemToSave = {
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.thumbnail || images[0],
      price: discountedPrice,
      qty,
      size: product.packSize?.name,
      type: product.packType?.name,
      currency: "NGN",
    };

    if (!isAuthenticated) {
      localStorage.setItem("tempCartItem", JSON.stringify(itemToSave));
      router.push("/login?fromCart=true");
      return;
    }

    // If user already has item in draft cart, directly go checkout
    const existingItem = userDraftCart?.items?.find(
      (i) => i?.product?.id === product.id,
    );
    const orderId = user?.wholesalerProfile?.draftCart ?? draftCart;

    if (existingItem && orderId) {
      router.push(`/dashboard/marketplace/checkout?orderNumber=${orderId}`);
      return;
    }

    if (orderId) {
      await updateDraftOrder({
        payload: {
          item: {
            action: "ADD",
            productId: product.id,
            quantity: qty,
          },
        },
        id: orderId,
      });
      router.push(`/dashboard/marketplace/checkout?orderNumber=${orderId}`);
      return;
    }

  };

  return (
    <div className="max-w-full mx-auto py-8 px-4">
      {/* Back — plain text link, no border */}
      <Link
        href="/dashboard/marketplace"
        className="inline-flex items-center h-8.5 font-medium text-[15px] leading-[1.2] tracking-[0.04em] text-body hover:text-primary mb-2 transition-colors border border-border-main table-tag bg-storey-foreground p-md rounded-md outline-none"
      >
        Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-main items-start py-main">
        {/* ── LEFT: image gallery ───────────────────────────── */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Main image */}
          <div className="relative aspect-square w-full rounded-2xl bg-storey-foreground overflow-hidden border border-gray-200">
            <Image
              src={images[activeImage] ?? ""}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6 md:p-12 lg:p-16"
              priority
            />
          </div>

          {/* Thumbnails — always show, highlight active */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                // onClick={() => setActiveImage(i)}
                className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all duration-150 bg-storey-foreground 
                  ${i === activeImage ? "" : ""}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  className="object-contain p-6 lg:p-8"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: product info ───────────────────────────── */}
        <div className="md:col-span-2 flex flex-col gap-sm py-main">
          <div className="flex flex-col gap-md py-5 px-lg">
            {/* Product name */}
            <h2 className="text-body font-semibold">{product.name}</h2>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-body-passive leading-[1.5] tracking-[0.04em]">
                {product.description}
              </p>
            )}

            {/* Meta tags — only render when at least one exists */}
            {/* {metaTags.length > 0 && (
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
            )} */}

            {/* Quantity selector */}
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-body tracking-[0.01em] leading-[1.2]">
                Quantity
              </p>
              <div>
                <Input
                  type="number"
                  placeholder="20"
                  min={1}
                  value={qty}
                  onChange={handleQuantityChange}
                  className="w-21 h-10.5 text-xl font-semibold text-body leading-[1.2] tracking-[0.01em]"
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex py-main mt-19">
              <h2 className="font-semibold text-body">
                {formatPrice(price * qty)}
                {/* {formatPrice(discountedPrice * qty)} */}
              </h2>
              {/* {Number(product.discount) > 0 && (
                <p className="text-sm text-body-passive line-through mt-0.5">
                  {formatPrice(price * qty)}
                </p>
              )} */}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-main">
              <Button
                className="w-full gap-4 tracking-[0.02em]"
                onClick={handleBuyNow}
                disabled={updating}
              >
                <ShoppingBag className="h-5 w-5" />
                {updating ? "Updating cart..." : "Buy now"}
              </Button>
              <Button
                variant="neutral"
                className="w-full gap-4 text-primary tracking-[0.02em]"
                onClick={() => handleAddToCart(product, "ADD")}
                disabled={updating}
              >
                <ShoppingCart className="h-5 w-5" />
                {updating ? "Updating cart..." : "Add to cart"}
              </Button>
            </div>

            {/* Legal — inside a storey-foreground card (matches Figma) */}
            <div className="rounded-xl bg-storey-foreground p-main">
              <p className="text-sm font-medium text-body-passive leading-[1.5] tracking-[0.04em]">
                By using <span className="text-heading">jooav.com</span>, you
                agree to our{" "}
                <Link href="/terms" className="text-heading underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-heading underline">
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
    </div>
  );
}
