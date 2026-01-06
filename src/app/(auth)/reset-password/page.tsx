import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import LoadingScreen from "@/layouts/LoadingScreen";
import React, { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <div className="w-full">
      <Suspense fallback={<LoadingScreen className="w-full"/>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
