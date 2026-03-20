"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { useState, Suspense } from "react";

const LoginPageComponent = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {showForgotPassword ? (
        <ForgotPasswordForm toggleForm={() => setShowForgotPassword(false)} />
      ) : (
        <LoginForm toggleForm={() => setShowForgotPassword(true)} />
      )}
    </Suspense>
  );
};

export default LoginPageComponent;
