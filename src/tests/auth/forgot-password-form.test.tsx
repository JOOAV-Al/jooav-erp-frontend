import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import { renderWithProviders } from "@/tests/test-utils";
import { useForgotPassword } from "@/features/auth/services/auth.api";

/* ============================
   MOCKS
============================ */

jest.mock("@/features/auth/services/auth.api", () => ({
  useForgotPassword: jest.fn(),
}));

/* ============================
   TESTS
============================ */

describe("ForgotPasswordForm", () => {
  const toggleFormMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders forgot password form", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ForgotPasswordForm toggleForm={toggleFormMock} />);

    expect(
      screen.getByRole("heading", { name: /reset password/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Enter your email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /get reset link/i })
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();

    (useForgotPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ForgotPasswordForm toggleForm={toggleFormMock} />);

    await user.click(screen.getByRole("button", { name: /get reset link/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("submits email to forgot password API", async () => {
    const user = userEvent.setup();

    const forgotPasswordMock = jest.fn().mockResolvedValue({
      data: { message: "Reset link sent" },
    });

    (useForgotPassword as jest.Mock).mockReturnValue({
      mutateAsync: forgotPasswordMock,
      isPending: false,
    });

    renderWithProviders(<ForgotPasswordForm toggleForm={toggleFormMock} />);

    await user.type(
      screen.getByPlaceholderText(/Enter your email/i),
      "user@example.com"
    );

    await user.click(screen.getByRole("button", { name: /get reset link/i }));

    await waitFor(() => {
      expect(forgotPasswordMock).toHaveBeenCalledWith({
        email: "user@example.com",
      });
    });
  });

  it("disables submit button while loading", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
    });

    renderWithProviders(<ForgotPasswordForm toggleForm={toggleFormMock} />);

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });

  it("toggles back to login", async () => {
    const user = userEvent.setup();

    (useForgotPassword as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ForgotPasswordForm toggleForm={toggleFormMock} />);

    await user.click(screen.getByRole("button", { name: /back to login/i }));

    expect(toggleFormMock).toHaveBeenCalled();
  });
});
