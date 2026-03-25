"use client";

import PaymentVerificationPageComponent from "@/features/marketplace/components/PaymentVerificationPageComponent";
import LoadingScreen from "@/layouts/LoadingScreen";
import { Suspense } from "react";

export default function PaymentVerificationPage() {
  return (
    <div>
      <Suspense fallback={<LoadingScreen className="w-full min-h-screen" />}>
        <PaymentVerificationPageComponent />
      </Suspense>
    </div>
  );
}
