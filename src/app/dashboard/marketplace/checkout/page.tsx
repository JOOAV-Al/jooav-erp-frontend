"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, ShoppingBag, Edit3 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
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
import {
  CreateOrderPayload,
  Order,
  OrderItem,
  Product,
} from "@/features/marketplace/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import OrdersGroupedTable from "@/features/marketplace/components/OrdersGroupedTable";
import OrderCard from "@/features/marketplace/components/OrderCard";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { updateCartNumber } from "@/redux/slices/authSlice";
import EmptyState from "@/components/general/EmptyState";
import { Spinner } from "@/components/ui/spinner";
// import Spinner from "@/components/general/Spinner";

function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CheckoutSummaryPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const draftCart = auth.cartDraftNumber;

  const router = useRouter();
  const dispatch = useDispatch();
  const [showEditAddress, setShowEditAddress] = useState(false);

  const { data, isPending, refetch } = useGetOrderDetails({
    orderNumber: draftCart ?? "",
  });
  const userDraftCart = data?.data;
  const [editAddress, setEditAddress] = useState(
    userDraftCart?.deliveryAddress?.address || "",
  );

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
    const res = await updateDraftOrder({
      payload,
      id: user?.wholesalerProfile?.draftCart ?? "",
    });
    refetch();
    // if (res.data.status === "success") {
    //     dispatch(removeFromCart(itemToSave));
    // }
  };

  // ── Proceed to payment (primary on order-list) ────────────────────────────
  const handleProceedToPayment = async () => {
    if (!draftCart) return;

    // Check if a previous checkout URL exists and is still valid
    const now = new Date();
    const expiresAt = userDraftCart?.paymentExpiresAt
      ? new Date(userDraftCart?.paymentExpiresAt)
      : null;
    const isExpired = !expiresAt || expiresAt <= now;
    const hasValidCheckout = !!userDraftCart?.checkoutUrl && !isExpired;

    if (hasValidCheckout) {
      // Still valid — skip re-initiation, route to payment page
      router.push(
        `/dashboard/marketplace/checkout/complete-payment?orderNumber=${draftCart}`,
      );
      return;
    }

    // Expired or never initiated — call initiate-payment endpoint
    const deliveryAddress = editAddress ? { address: editAddress } : undefined;
    const res =
      userDraftCart?.status === "DRAFT"
        ? await initiatePayment({
            orderNumber: draftCart ?? "",
            deliveryAddress,
          })
        : await reInitiatePayment({
            orderNumber: draftCart ?? "",
            deliveryAddress,
          });

    if (res.data.status === "success") {
      dispatch(
        updateCartNumber({
          orderNumber:
            res.data.data?.order?.orderNumber ?? userDraftCart?.orderNumber,
        }),
      );
      router.push(
        `/dashboard/marketplace/checkout/complete-payment?orderNumber=${res.data.data?.order?.orderNumber}`,
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

      <div className="py-sm">
        <h2>Order checkout</h2>
      </div>

      {/* <>
      {isPending ? (

      ) : (

      )}
      </> */}

      <div className="grid grid-cols-1 mdxl:grid-cols-5 gap-main items-start py-main">
        {/* ── LEFT: checkout ───────────────────────────── */}
        <div className="mdxl:col-span-3 flex flex-col gap-main py-md">
          {/*order card */}
          <OrderCard
            order={userDraftCart!}
            actionLoading={updating}
            onRemoveItem={handleRemoveItem}
            // showActions={showActions}
            showStatus={false}
            withCheckbox={false}
            refetch={refetch}
          />
        </div>

        {/* ── RIGHT: Summary ───────────────────────────── */}
        <div className="mdxl:col-span-2 flex flex-col gap-sm py-main">
          <div className="flex flex-col gap-[16px] pt-lg pb-main px-main bg-storey-foreground rounded-2xl w-full">
            {/* One */}
            <div className="py-sm px-5">
              <h3>Order checkout</h3>
            </div>

            {/* Two */}
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

              <div>
                {!showEditAddress ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                        Delivery address:
                      </p>
                      <Edit3
                        onClick={() => setShowEditAddress(true)}
                        size={16}
                        className="text-outline-passive"
                      />
                    </div>
                    <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                      {editAddress ?? "-"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <p className="py-2 leading-[1.2] tracking-[0.04em] text-body-passive text-[0.875rem]">
                      Delivery address:
                    </p>

                    <Textarea
                      cols={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Street no., Street name, City, State"
                    />

                    <p className="text-body font-medium text-[14px] leading-[1.5] tracking-[0.04em]">
                      {editAddress ?? "-"}
                    </p>
                  </div>
                )}
              </div>

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

            {/* three */}
            <div className="flex flex-col gap-[8px] px-5 py-main border-y border-border-main">
              <p className="font-family-mono text-[12px] py-2 leading-[1.2] tracking-[0.08em] uppercase text-body-passive">
                Total
              </p>
              <h2 className="font-semibold text-body">
                {formatPrice(Number(userDraftCart?.totalAmount) ?? 0)}
              </h2>
            </div>
            <Button
              className="w-full gap-4 tracking-[0.02em]"
              onClick={handleProceedToPayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <div className="flex items-center">
                  <Spinner /> <div>Processing...</div>
                </div>
              ) : (
                <div className="flex items-center">Proceed to payment</div>
              )}

              {/* {paymentLoading ? <Spinner /> : <ShoppingBag className="h-5 w-5" />}
              {paymentLoading ? "Processing..." : "Proceed to payment"} */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
