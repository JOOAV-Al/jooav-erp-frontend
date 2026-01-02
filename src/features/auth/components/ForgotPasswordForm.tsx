"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  // FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForgotPassword } from "@/features/auth/services/auth.api";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import { useState } from "react";
import { MailIcon } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export function ForgotPasswordForm({ toggleForm }: { toggleForm: () => void }) {
  const [message, setMessage] = useState<string>("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const response = await forgotPassword(values);
    setMessage(response?.data?.message);
  };

  return (
    <div className="auth-card shadow-card flex flex-col gap-7 h-[530px]">
      <AuthCardHeader
        header="Reset Password"
        description="You’ll get a password reset link if we have your details in our database"
      />
      <FieldSet className="flex flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <FieldGroup className="flex flex-col gap-7">
            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Email</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      aria-invalid={fieldState.invalid}
                      leftIcon={<MailIcon className="h-4 w-4" />}
                    />
                  </Field>
                </div>
              )}
            />

            <Button
              type="button"
              variant={"ghost"}
              size={"ghost"}
              className="w-fit h-fit p-0"
              onClick={toggleForm}
            >
              Back to login
            </Button>

            {/* SERVER ERROR */}
            {/* {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as any)?.response?.data?.message ||
                    "FOrgotPassword failed. Please try again."}
                </AlertDescription>
              </Alert>
            )} */}
          </FieldGroup>
          <div className="mt-auto">
            {/* SUBMIT */}

            <Button type="submit" className="w-full mt-7" disabled={isPending}>
              {isPending ? "Loading..." : "Get reset link"}
            </Button>
          </div>
        </form>
      </FieldSet>
    </div>
  );
}

export default ForgotPasswordForm;
