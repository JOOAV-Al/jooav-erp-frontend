"use client";

import PaymentVerificationPageComponent from "@/features/marketplace/components/PaymentVerificationPageComponent";
import { Suspense } from "react";

export default function PaymentVerificationPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentVerificationPageComponent />
      </Suspense>
    </div>
  );
}
