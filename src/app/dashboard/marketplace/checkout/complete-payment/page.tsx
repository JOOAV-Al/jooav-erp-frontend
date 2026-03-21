"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetOrderDetails } from "@/features/marketplace/services/marketplace.api";
import { RootState } from "@/redux/store";
import EmptyState from "@/components/general/EmptyState";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

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

  useEffect(() => {
    if (
      initiatedOrder?.checkoutUrl &&
      hasValidCheckoutUrl(initiatedOrder.checkoutUrl)
    ) {
      window.location.href = initiatedOrder.checkoutUrl;
    }
  }, [initiatedOrder]);

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
      <div className="py-24 flex flex-col gap-main max-w-7xl mx-auto px-4">
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
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner className="size-8" />
      <div className="text-center">
        <h4 className="mb-2">Redirecting to Payment Gateway</h4>
        <p className="text-body-muted">
          Please wait while we securely take you to the Monnify checkout page.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/dashboard/marketplace"
          className="text-sm text-body-muted hover:text-primary transition-colors underline underline-offset-4"
        >
          Cancel and go back to Marketplace
        </Link>
      </div>
    </div>
  );
}
