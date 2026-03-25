"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit3, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
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

// ── Helpers ─────────────────────────────────────────────────────────────────────
function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CheckoutSummaryPageComponent() {
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
  const deliveryAddress = userDraftCart?.deliveryAddress?.address ?? "";
  const [address, setAddress] = useState(deliveryAddress);

  const { mutateAsync: updateDraftOrder, isPending: removing } =
    useUpdateDraftOrder();
  const { mutateAsync: updateAddress, isPending: updatingAddress } =
    useUpdateDraftOrder();
  const { mutateAsync: initiatePayment, isPending: initiatingPayment } =
    useInitiateOrderPayment();
  const { mutateAsync: reInitiatePayment, isPending: reInitiatingPayment } =
    useReInitiateOrderPayment();

  const dummyFiveDaysEstimated = new Date();
  dummyFiveDaysEstimated.setDate(dummyFiveDaysEstimated.getDate() + 5);
  const allowedPreviousCheckoutStatus = ["DRAFT", "PENDING_PAYMENT"]

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

  const handleUpdateAddress = async () => {
    if (!selectedOrderNumber) return;
    const payload: CreateOrderPayload = {
      deliveryAddress: {
        address,
      },
    };
    await updateAddress({
      payload,
      id: user?.wholesalerProfile?.draftCart ?? "",
    });
    setShowEditAddress(false);
    refetch();
  };

  // ── Proceed to payment (validated) ────────────────────────────────────────
  const handleProceedToPayment = async () => {
    if (!selectedOrderNumber) return;
    if (!userDraftCart) return;

    // Check if a previous checkout URL exists and is still valid
    const now = new Date();
    const expiresAt = userDraftCart?.paymentExpiresAt
      ? new Date(userDraftCart?.paymentExpiresAt)
      : null;
    const isExpired = !expiresAt || expiresAt <= now;
    const hasValidCheckout = !!userDraftCart?.checkoutUrl && !isExpired;

    if (hasValidCheckout && allowedPreviousCheckoutStatus.includes(userDraftCart?.status)) {
      // Still valid — skip re-initiation, route to payment page
      router.push(
        `/dashboard/checkout/complete-payment?orderNumber=${selectedOrderNumber}`,
      );
      return;
    }

    // Expired or never initiated — call initiate-payment endpoint
    const res =
      userDraftCart?.status === "DRAFT"
        ? await initiatePayment({
            orderNumber: selectedOrderNumber ?? "",
          })
        : await reInitiatePayment({
            orderNumber: selectedOrderNumber ?? "",
          });

    if (res.data.status === "success") {
      dispatch(
        updateCartNumber({
          orderNumber:
            res.data.data?.order?.orderNumber ?? userDraftCart?.orderNumber,
        }),
      );
      router.push(
        `/dashboard/checkout/complete-payment?orderNumber=${res.data.data?.order?.orderNumber}`,
      );
      refetch();
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
          href="/dashboard/orders?tab=incomplete"
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
    <div className="max-w-full mx-auto">
      <Link
        href="/dashboard/orders"
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
            isRemoving={removing}
            onRemoveItem={handleRemoveItem}
            showStatus={false}
            withCheckbox={false}
            showFooter={false}
          />
        </div>

        {/* ── RIGHT: Summary ───────────────────────────── */}
        <div className="mdxl:col-span-2 flex flex-col gap-sm py-main">
          <div className="flex flex-col gap-[16px] pt-lg pb-main px-main bg-storey-foreground rounded-2xl w-full">
            {/* Header */}
            <div className="hidden mdx:block py-sm px-5">
              <h3>Order checkout</h3>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-md px-5">
              <div className="flex justify-between">
                <div className="flex flex-col gap-5">
                  <p className="font-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                    order for:
                  </p>
                  <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <p className="font-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                    ordered no:
                  </p>
                  <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                    {userDraftCart?.orderNumber}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                {!showEditAddress ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <p className="font-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
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
                    <div className="flex justify-between items-center">
                      <p className="py-2 leading-[1.2] tracking-[0.04em] text-body-passive text-[0.875rem]">
                        Delivery address:{" "}
                      </p>
                      <X
                        onClick={() => setShowEditAddress(false)}
                        size={16}
                        className="text-outline-passive cursor-pointer"
                      />
                    </div>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      cols={3}
                      placeholder="Street no., Street name, City, State"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-5">
                  <p className="font-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
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
                  <p className="font-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
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
              <p className="font-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                Total
              </p>
              <h2 className="font-semibold text-body">
                {formatPrice(Number(userDraftCart?.totalAmount) ?? 0)}
              </h2>
            </div>

            {showEditAddress ? (
              <Button
                type="button"
                className="w-full tracking-[0.02em]"
                disabled={updatingAddress}
                onClick={handleUpdateAddress}
              >
                {updatingAddress ? (
                  <>
                    <Spinner color="white" /> Updating...
                  </>
                ) : (
                  "Update address"
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full gap-4 tracking-[0.02em]"
                disabled={paymentLoading}
                onClick={handleProceedToPayment}
              >
                {paymentLoading ? (
                  <>
                    <Spinner color="white" /> Processing...
                  </>
                ) : (
                  "Proceed to payment"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
