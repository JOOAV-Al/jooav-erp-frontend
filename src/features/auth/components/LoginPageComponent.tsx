import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import LoginForm from "@/features/auth/components/LoginForm";
import React, { useState } from "react";

const LoginPageComponent = () => {
  const [showForgetPassword, setShowForgetPassword] = useState<boolean>(false);
  const toggleForm = () =>
    setShowForgetPassword((showForgetPassword) => !showForgetPassword);
  return showForgetPassword ? (
    <ForgotPasswordForm toggleForm={toggleForm} />
  ) : (
    <LoginForm toggleForm={toggleForm} />
  );
};

export default LoginPageComponent;
