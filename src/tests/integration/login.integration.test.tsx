import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import LoginForm from "@/features/auth/components/LoginForm";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("successful login", async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: { token: "fake-token" },
  });

  render(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "password123");

  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(mockedAxios.post).toHaveBeenCalled();
});

test("failed login shows error", async () => {
  mockedAxios.post.mockRejectedValueOnce({
    response: {
      data: { message: "Invalid credentials" },
    },
  });

  render(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "password123");

  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});

