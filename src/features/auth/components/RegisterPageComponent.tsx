"use client";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Suspense } from "react";

const RegisterPageComponent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPageComponent;
