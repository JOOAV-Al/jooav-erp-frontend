"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Spinner from "@/components/general/Spinner";
import { useConfirmOrderPayment } from "@/features/marketplace/services/marketplace.api";

export default function PaymentVerificationPageComponent() {
  const params = useSearchParams();
  const paymentReference = params.get("paymentReference");
  const [paymentMessage, setPaymentMessage] = useState("Verifying payment");

  const { mutateAsync: confirmPayment } = useConfirmOrderPayment();

  //TODO: Replace wildcard with app domain
  useEffect(() => {
    const verify = async () => {
      if (!paymentReference) return;

      try {
        const res = await confirmPayment({
          orderNumber: paymentReference,
        });
        if (res?.data?.data?.success) {
          setPaymentMessage(res.data?.data?.message ?? "Payment Successful");
        } else {
          setPaymentMessage(res.data?.data?.message ?? "Payment Failed");
        }
        // notify parent window (your app)
        window.parent.postMessage(
          {
            type: "PAYMENT_SUCCESS",
            orderNumber: paymentReference,
          },
          "*",
        );
      } catch (err) {
        console.error(err);
        setPaymentMessage("Payment Failed. An error occurred");

        window.parent.postMessage(
          {
            type: "PAYMENT_FAILED",
          },
          "*",
        );
      }
    };

    verify();
  }, [paymentReference]);

  return (
    <div className="flex flex-col bg-white! items-center gap-sm justify-center min-h-200">
      <Spinner className="size-6" />
      <h4>{paymentMessage}</h4>
    </div>
  );
}
