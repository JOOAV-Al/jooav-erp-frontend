"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { useState } from "react";

const LoginPageComponent = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return showForgotPassword ? (
    <ForgotPasswordForm toggleForm={() => setShowForgotPassword(false)} />
  ) : (
    <LoginForm toggleForm={() => setShowForgotPassword(true)} />
  );
};

export default LoginPageComponent;
