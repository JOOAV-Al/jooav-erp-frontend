"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/redux/store";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <Provider store={store}>
          {children}
          <Toaster />
      </Provider>
    </ReactQueryProvider>
  );
}
