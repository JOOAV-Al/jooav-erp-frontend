import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";

export function renderWithProviders(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </Provider>
    ),
  };
}
