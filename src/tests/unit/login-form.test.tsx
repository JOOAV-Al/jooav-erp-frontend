import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/features/auth/components/LoginForm";

test("shows validation error when fields are empty", async () => {
  render(<LoginForm />);

  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});
