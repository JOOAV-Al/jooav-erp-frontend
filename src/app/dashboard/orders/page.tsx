"use client";

import OrdersPageComponent from "@/features/marketplace/components/OrdersPageComponent";
import LoadingScreen from "@/layouts/LoadingScreen";
import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <div>
      <Suspense fallback={<LoadingScreen className="w-full min-h-screen" />}>
        <OrdersPageComponent />
      </Suspense>
    </div>
  );
}
