"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetOrderDetails } from "@/features/marketplace/services/marketplace.api";
import { RootState } from "@/redux/store";
import EmptyState from "@/components/general/EmptyState";
import PaymentScreen from "@/features/marketplace/components/PaymentScreen";
import Spinner from "@/components/general/Spinner";

export default function CompletePaymentPage() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber");
  const auth = useSelector((state: RootState) => state.auth);
  const draftCart = auth.cartDraftNumber;

  const { data, isPending } = useGetOrderDetails({
    orderNumber: orderNumber || draftCart || "",
  });
  const initiatedOrder = data?.data;

  const hasValidCheckoutUrl = (checkoutUrl: string | undefined) => {
    if (!checkoutUrl) return false;
    const now = new Date();
    const expiresAt = initiatedOrder?.paymentExpiresAt
      ? new Date(initiatedOrder?.paymentExpiresAt)
      : null;
    const isExpired = !expiresAt || expiresAt <= now;
    const hasValidCheckout = !!initiatedOrder?.checkoutUrl && !isExpired;
    return hasValidCheckout;
  };

  // console.log(initiatedOrder?.checkoutUrl)

  if (isPending)
    return (
      <div className="flex min-h-[60vh] justify-center items-center">
        <Spinner />
      </div>
    );

  if (
    !initiatedOrder ||
    initiatedOrder?.items?.length === 0 ||
    !hasValidCheckoutUrl(initiatedOrder?.checkoutUrl)
  ) {
    return (
      <div className="py-24 flex flex-col gap-main">
        <Link
          href="/dashboard/marketplace"
          className="inline-flex items-center h-8.5 font-medium text-[15px] leading-[1.2] tracking-[0.04em] text-body hover:text-primary mb-2 transition-colors border border-border-main table-tag bg-storey-foreground p-md rounded-md outline-none"
        >
          Back
        </Link>
        <EmptyState
          header="Order not found"
          description="The order you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto py-8 px-4 flex flex-col flex-1">
      {/* Back — plain text link, no border */}
      <Link
        href="/dashboard/marketplace"
        className="inline-flex items-center w-fit h-8.5 font-medium text-[15px] leading-[1.2] tracking-[0.04em] text-body hover:text-primary mb-2 transition-colors border border-border-main table-tag bg-storey-foreground p-md rounded-md outline-none"
      >
        Back
      </Link>
      <div className="py-sm">
        <h4>Complete Payment</h4>
      </div>

      <div className="flex-1">
        {initiatedOrder?.checkoutUrl && (
          <PaymentScreen checkoutUrl={initiatedOrder?.checkoutUrl} />
        )}
      </div>
    </div>
  );
}
