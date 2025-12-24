"use client"
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import LoginForm from "@/features/auth/components/LoginForm";
import React, { useState } from "react";

const LoginPage = () => {
  const [showForgetPassword, setShowForgetPassword] = useState<boolean>(false);
  const toggleForm = () =>
    setShowForgetPassword((showForgetPassword) => !showForgetPassword);
  return (
    <div className="min-h-screen px-main py-10 flex justify-center">
      <div className="w-full">
        {showForgetPassword ? (
          <ForgotPasswordForm toggleForm={toggleForm} />
        ) : (
          <LoginForm toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
