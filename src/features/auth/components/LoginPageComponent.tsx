"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { useState, Suspense } from "react";
import LoadingScreen from "@/layouts/LoadingScreen";

const LoginPageComponent = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Suspense fallback={<LoadingScreen className="w-full min-h-screen" />}>
      {showForgotPassword ? (
        <ForgotPasswordForm toggleForm={() => setShowForgotPassword(false)} />
      ) : (
        <LoginForm toggleForm={() => setShowForgotPassword(true)} />
      )}
    </Suspense>
  );
};

export default LoginPageComponent;
