"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { useResetPassword } from "@/features/auth/services/auth.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import PasswordInput from "@/features/auth/components/PasswordInput";

const useResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password mismatch"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const otp = params.get("otp");

  const form = useForm<z.infer<typeof useResetPasswordSchema>>({
    resolver: zodResolver(useResetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const onSubmit = async (values: z.infer<typeof useResetPasswordSchema>) => {
    const response = await resetPassword({
      token: otp ?? "",
      password: values.password,
    });
    dispatch(
      setCredentials({
        user: response?.data.user,
        token: response?.data.token,
      })
    );
    router.push("/dashboard");
  };

  const watchedPassword = form.watch("password");

  return (
    <div className="p-xl rounded-3xl mx-auto w-full max-w-105 bg-card shadow-card flex flex-col gap-7 h-[530px]">
      <AuthCardHeader
        header="Create password"
        description="Create a new password for your login"
      />
      <FieldSet className="flex flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <FieldGroup className="flex flex-col gap-7">
            {/* NEW PASSWORD */}
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel aria-invalid={undefined}>
                      New Password
                    </FieldLabel>
                    {/* <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      aria-invalid={fieldState.invalid}
                    /> */}
                    <PasswordInput
                      field={field}
                      placeholder="Enter new password"
                      ariaInvalid={fieldState.invalid}
                    />
                  </Field>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </div>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <div>
                  <Field
                    data-invalid={fieldState.invalid}
                    // className="data-[invalid=true]:text-card-foreground"
                  >
                    <div className="flex gap-3 items-center">
                      <FieldLabel className="">Confirm Password</FieldLabel>
                      {fieldState.error && watchedPassword.length >= 8 && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                      {isValid && (
                        <FieldDescription className="text-success-500">
                          : {"Password match"}
                        </FieldDescription>
                      )}
                    </div>
                    <PasswordInput
                      field={field}
                      placeholder="Enter password"
                      ariaInvalid={fieldState.invalid}
                    />
                    {/* <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      aria-invalid={fieldState.invalid}
                    /> */}
                  </Field>
                </div>
              )}
            />

            <Button
              type="button"
              variant={"ghost"}
              size={"ghost"}
              className="w-fit h-fit p-0"
              onClick={() => router.push("/login")}
            >
              Back to login?
            </Button>

            {/* SERVER ERROR */}
            {/* {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as any)?.response?.data?.message ||
                    "UseResetPassword failed. Please try again."}
                </AlertDescription>
              </Alert>
            )} */}
          </FieldGroup>
          {/* SUBMIT */}
          <div className="mt-auto">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Change Password"}
            </Button>
          </div>
        </form>
      </FieldSet>
    </div>
  );
}

export default ResetPasswordForm;
