"use client";

import Spinner from "@/components/general/Spinner";
import { useState, useEffect } from "react";

const PaymentScreen = ({
  checkoutUrl,
  setOpen,
  refetch,
  setFormView,
}: {
  checkoutUrl?: string;
  setOpen?: (open: boolean) => void;
  refetch?: () => void;
  setFormView?: (view: "order-list" | "payment") => void;
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PAYMENT_SUCCESS") {
        setTimeout(() => {
          setOpen?.(false);
        }, 2000);
        refetch?.();
      }
      if (event.data?.type === "PAYMENT_FAILED") {
        // setTimeout(() => {
        //   setOpen?.(false);
        // }, 2000);
        setFormView?.("order-list");
        refetch?.();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [setOpen]);

  return (
    <div className="relative w-full h-full rounded-lg border flex flex-col pb-6">
      {/* Loader */}
      {iframeLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Spinner className="size-6" />
        </div>
      )}

      <iframe
        src={checkoutUrl}
        title="Monnify Checkout"
        className="w-full flex-1 border-none"
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
};

export default PaymentScreen;
