"use client";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import LoadingScreen from "@/layouts/LoadingScreen";
import { Suspense } from "react";

const RegisterPageComponent = () => {
  return (
    <Suspense fallback={<LoadingScreen className="w-full min-h-screen" />}>
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPageComponent;
