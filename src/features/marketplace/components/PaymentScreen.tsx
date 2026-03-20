"use client";

import Spinner from "@/components/general/Spinner";
import { useState, useEffect } from "react";

const PaymentScreen = ({
  checkoutUrl,
}: {
  checkoutUrl?: string;
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  // console.log(iframeLoading)
  // console.log(checkoutUrl)
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
        className="w-full border-none min-h-[80vh]"
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
};

export default PaymentScreen;
