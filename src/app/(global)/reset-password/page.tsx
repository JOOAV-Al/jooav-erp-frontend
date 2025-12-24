import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import React from "react";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen px-main py-10 flex justify-center">
      <div className="w-full">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
