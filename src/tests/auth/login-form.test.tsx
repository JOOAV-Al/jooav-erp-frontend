import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";
import LoginForm from "@/features/auth/components/LoginForm";
import { renderWithProviders } from "@/tests/test-utils";
import { useLogin } from "@/features/auth/services/auth.api";

/* ============================
   MOCKS
============================ */

// Mock useLogin hook
jest.mock("@/features/auth/services/auth.api", () => ({
  useLogin: jest.fn(),
}));

// Mock next/router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock js-cookie
jest.mock("js-cookie", () => ({
  set: jest.fn(),
}));

// Mock PasswordInput to a normal input
jest.mock("@/features/auth/components/PasswordInput", () => {
  return function MockPasswordInput({ field, placeholder }: any) {
    return <input type="password" placeholder={placeholder} {...field} />;
  };
});

/* ============================
   TESTS
============================ */

describe("LoginForm", () => {
  const toggleFormMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    (useLogin as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<LoginForm toggleForm={toggleFormMock} />);

    expect(
      screen.getByRole("heading", { name: /super-admin login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /admin login/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when fields are invalid", async () => {
    const user = userEvent.setup();

    (useLogin as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<LoginForm toggleForm={toggleFormMock} />);

    await user.click(screen.getByRole("button", { name: /admin login/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/must be 8 characters/i)
    ).toBeInTheDocument();
  });

  it("submits login form and stores tokens", async () => {
    const user = userEvent.setup();

    const loginMock = jest.fn().mockResolvedValue({
      data: {
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      },
    });

    (useLogin as jest.Mock).mockReturnValue({
      mutateAsync: loginMock,
      isPending: false,
    });

    renderWithProviders(<LoginForm toggleForm={toggleFormMock} />);

    await user.type(
      screen.getByPlaceholderText(/Enter your email/i),
      "admin@example.com"
    );

    await user.type(
      screen.getByPlaceholderText(/Enter password/i),
      "password123"
    );

    await user.click(screen.getByRole("button", { name: /admin login/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "password123",
      });
    });

    expect(Cookies.set).toHaveBeenCalledWith("authToken", "access-token");

    expect(Cookies.set).toHaveBeenCalledWith("refreshToken", "refresh-token");

    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("disables button while logging in", () => {
    (useLogin as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
    });

    renderWithProviders(<LoginForm toggleForm={toggleFormMock} />);

    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
  });

  it("toggles to forgot password", async () => {
    const user = userEvent.setup();

    (useLogin as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<LoginForm toggleForm={toggleFormMock} />);

    await user.click(screen.getByRole("button", { name: /forgot password/i }));

    expect(toggleFormMock).toHaveBeenCalled();
  });
});
