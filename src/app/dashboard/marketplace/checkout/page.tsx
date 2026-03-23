"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit3 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetOrderDetails,
  useInitiateOrderPayment,
  useReInitiateOrderPayment,
  useUpdateDraftOrder,
} from "@/features/marketplace/services/marketplace.api";
import { Button } from "@/components/ui/button";
import ProductDetailSkeleton from "@/features/marketplace/components/ProductDetailSkeleton";
import { RootState } from "@/redux/store";
import { CreateOrderPayload, OrderItem } from "@/features/marketplace/types";
import OrderCard from "@/features/marketplace/components/OrderCard";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { updateCartNumber } from "@/redux/slices/authSlice";
import EmptyState from "@/components/general/EmptyState";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// ── Schema ─────────────────────────────────────────────────────────────────────
const checkoutSchema = z.object({
  deliveryAddress: z
    .string()
    .min(1, "Delivery address is required.")
    .min(5, "Please enter a valid delivery address."),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ── Helpers ─────────────────────────────────────────────────────────────────────
function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CheckoutSummaryPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;
  const draftCart = auth.cartDraftNumber;
  const searchParams = useSearchParams();
  const queryOrderNumber = searchParams.get("orderNumber");
  const selectedOrderNumber = queryOrderNumber || draftCart;

  const router = useRouter();
  const dispatch = useDispatch();
  const [showEditAddress, setShowEditAddress] = useState(false);

  const { data, isPending, refetch } = useGetOrderDetails({
    orderNumber: selectedOrderNumber ?? "",
  });
  const userDraftCart = data?.data;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    values: {
      deliveryAddress: userDraftCart?.deliveryAddress?.address ?? "",
    },
  });

  const deliveryAddress = watch("deliveryAddress");

  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();
  const { mutateAsync: initiatePayment, isPending: initiatingPayment } =
    useInitiateOrderPayment();
  const { mutateAsync: reInitiatePayment, isPending: reInitiatingPayment } =
    useReInitiateOrderPayment();

  const dummyFiveDaysEstimated = new Date();
  dummyFiveDaysEstimated.setDate(dummyFiveDaysEstimated.getDate() + 5);

  const handleRemoveItem = async (item: OrderItem) => {
    if (!item) return;
    const payload: CreateOrderPayload = {
      item: {
        action: "REMOVE",
        productId: item?.id,
        quantity: item?.quantity,
        itemId: item?.id,
      },
    };
    await updateDraftOrder({
      payload,
      id: user?.wholesalerProfile?.draftCart ?? "",
    });
    refetch();
  };

  // ── Proceed to payment (validated) ────────────────────────────────────────
  const onSubmit = async (values: CheckoutFormValues) => {
    if (!selectedOrderNumber) return;
    if (!userDraftCart) return;

    const deliveryAddressPayload = { address: values.deliveryAddress };

    try {
      let res;

      if (userDraftCart.status === "DRAFT") {
        const now = new Date();
        const expiresAt = userDraftCart.paymentExpiresAt
          ? new Date(userDraftCart.paymentExpiresAt)
          : null;
        const isExpired = !expiresAt || expiresAt <= now;
        const hasValidCheckout = !!userDraftCart.checkoutUrl && !isExpired;

        if (hasValidCheckout) {
          router.push(
            `/dashboard/marketplace/checkout/complete-payment?orderNumber=${selectedOrderNumber}`,
          );
          return;
        }

        res = await initiatePayment({
          orderNumber: selectedOrderNumber,
          deliveryAddress: deliveryAddressPayload,
        });
      } else {
        res = await reInitiatePayment({
          orderNumber: selectedOrderNumber,
          deliveryAddress: deliveryAddressPayload,
        });
      }

      if (res.data.status === "success") {
        if (!queryOrderNumber) {
          dispatch(
            updateCartNumber({
              orderNumber:
                res.data.data?.order?.orderNumber ?? userDraftCart?.orderNumber,
            }),
          );
        }
        router.push(
          `/dashboard/marketplace/checkout/complete-payment?orderNumber=${res.data.data?.order?.orderNumber}`,
        );
        refetch();
      }
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 404) {
        toast.error("Payment initialization failed. Please try again.");
        return;
      }

      toast.error("Unable to proceed to payment. Please try again.");
    }
  };

  const paymentLoading = initiatingPayment || reInitiatingPayment;

  if (isPending) return <ProductDetailSkeleton />;

  if (
    (!isPending && !userDraftCart) ||
    (userDraftCart && userDraftCart?.items?.length === 0)
  ) {
    return (
      <div className="py-24 flex flex-col gap-main">
        <Link
          href="/dashboard/marketplace"
          className="inline-flex items-center w-fit h-8.5 font-medium text-[15px] leading-[1.2] tracking-[0.04em] text-body hover:text-primary mb-2 transition-colors border border-border-main table-tag bg-storey-foreground p-md rounded-md outline-none"
        >
          Back
        </Link>
        <EmptyState
          header="No items found"
          description="You do not have any items in your cart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto py-8 px-4">
      <Link
        href="/dashboard/marketplace"
        className="inline-flex items-center w-fit h-8.5 font-medium text-[15px] leading-[1.2] tracking-[0.04em] text-body hover:text-primary mb-2 transition-colors border border-border-main table-tag bg-storey-foreground p-md rounded-md outline-none"
      >
        Back
      </Link>

      <div className="py-md mdx:py-sm">
        <h2>Order checkout</h2>
      </div>

      <div className="grid grid-cols-1 mdxl:grid-cols-5 gap-16 items-start py-main">
        {/* ── LEFT: order card ───────────────────────────── */}
        <div className="mdxl:col-span-3 flex flex-col gap-main py-md">
          <OrderCard
            order={userDraftCart!}
            actionLoading={updating}
            onRemoveItem={handleRemoveItem}
            showStatus={false}
            withCheckbox={false}
            refetch={refetch}
          />
        </div>

        {/* ── RIGHT: Summary ───────────────────────────── */}
        <div className="mdxl:col-span-2 flex flex-col gap-sm py-main">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[16px] pt-lg pb-main px-main bg-storey-foreground rounded-2xl w-full"
          >
            {/* Header */}
            <div className="hidden mdx:block py-sm px-5">
              <h3>Order checkout</h3>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-md px-5">
              <div className="flex justify-between">
                <div className="flex flex-col gap-5">
                  <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                    order for:
                  </p>
                  <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                    ordered no:
                  </p>
                  <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                    {userDraftCart?.orderNumber}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                {!(showEditAddress || !deliveryAddress) ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                        Delivery address:
                      </p>
                      <Edit3
                        onClick={() => setShowEditAddress(true)}
                        size={16}
                        className="text-outline-passive cursor-pointer"
                      />
                    </div>
                    <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                      {deliveryAddress || "-"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="py-2 leading-[1.2] tracking-[0.04em] text-body-passive text-[0.875rem]">
                      Delivery address:{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Textarea
                      cols={3}
                      {...register("deliveryAddress")}
                      placeholder="Street no., Street name, City, State"
                      className={
                        errors.deliveryAddress ? "border-destructive" : ""
                      }
                    />
                    {errors.deliveryAddress && (
                      <p className="text-destructive text-[12px] leading-[1.4]">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="flex justify-between">
                <div className="flex flex-col gap-5">
                  <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                    order date:
                  </p>
                  <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                    {format(
                      new Date(userDraftCart?.orderDate ?? ""),
                      "dd/MM/yyyy.",
                    )}
                  </p>
                </div>
                <div className="w-[1.38px] h-7 bg-[#D9D9D9]"></div>
                <div className="flex flex-col gap-5">
                  <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                    Est. delivery date:
                  </p>
                  <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                    {format(dummyFiveDaysEstimated, "dd/MM/yyyy.")}
                  </p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex flex-col gap-[8px] px-5 py-main border-y border-border-main">
              <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                Total
              </p>
              <h2 className="font-semibold text-body">
                {formatPrice(Number(userDraftCart?.totalAmount) ?? 0)}
              </h2>
            </div>

            <Button
              type="submit"
              className="w-full gap-4 tracking-[0.02em]"
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <div className="flex items-center">
                  <Spinner /> <div>Processing...</div>
                </div>
              ) : (
                <div className="flex items-center">Proceed to payment</div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
