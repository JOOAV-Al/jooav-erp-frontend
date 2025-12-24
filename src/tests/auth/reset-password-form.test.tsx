import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import { renderWithProviders } from "@/tests/test-utils";
import { useResetPassword } from "@/features/auth/services/auth.api";

/* ============================
   MOCKS
============================ */

jest.mock("@/features/auth/services/auth.api", () => ({
  useResetPassword: jest.fn(),
}));

// Mock router & search params
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => ({
    get: () => "mock-otp-token",
  }),
}));

// Mock PasswordInput
jest.mock("@/features/auth/components/PasswordInput", () => {
  return function MockPasswordInput({ field, placeholder }: any) {
    return <input type="password" placeholder={placeholder} {...field} />;
  };
});

/* ============================
   TESTS
============================ */

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders reset password form", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ResetPasswordForm />);

    expect(
      screen.getByRole("heading", { name: /create password/i })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter new password/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();

    (useResetPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ResetPasswordForm />);

    await user.type(screen.getByPlaceholderText(/Enter new password/i), "password123");

    await user.type(screen.getByPlaceholderText(/Enter password/i), "password321");

    await user.click(screen.getByRole("button", { name: /change password/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  it("submits reset password form and redirects", async () => {
    const user = userEvent.setup();

    const resetPasswordMock = jest.fn().mockResolvedValue({
      data: {
        user: { id: "1", email: "user@example.com" },
        token: "new-access-token",
      },
    });

    (useResetPassword as jest.Mock).mockReturnValue({
      mutateAsync: resetPasswordMock,
      isPending: false,
    });

    renderWithProviders(<ResetPasswordForm />);

    await user.type(screen.getByPlaceholderText(/Enter new password/i), "password123");

    await user.type(screen.getByPlaceholderText(/Enter password/i), "password123");

    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith({
        token: "mock-otp-token",
        newPassword: "password123",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("disables submit button while loading", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
    });

    renderWithProviders(<ResetPasswordForm />);

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });
});
