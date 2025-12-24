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
import { useLogin } from "@/features/auth/services/auth.api";
import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "@/redux/slices/authSlice";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import Cookies from "js-cookie"
import PasswordInput from "@/features/auth/components/PasswordInput";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const router = useRouter();
  // const dispatch = useDispatch();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    // formState: { isValid },
  } = form;

  const { mutateAsync: login, isPending } = useLogin();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { data } = await login(values);
    // console.log(data)

    Cookies.set("authToken", data.data.accessToken);
    Cookies.set("refreshToken", data.data.refreshToken);

    // dispatch(
    //   setCredentials({
    //     user: data.data.admin,
    //     token: data.data.accessToken,
    //   })
    // );
    router.push("/dashboard");
  };

  return (
    <div className="p-xl rounded-3xl mx-auto w-full max-w-105 bg-card shadow-card flex flex-col gap-7 h-[530px]">
      <AuthCardHeader
        header="Super-admin login"
        description="Log in with your admin credentials."
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
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </div>
              )}
            />

            {/* PASSWORD */}
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    {/* <Input
                      {...field}
                      autoComplete="off"
                      type="password"
                      placeholder="Enter password"
                      aria-invalid={fieldState.invalid}
                    /> */}
                    <PasswordInput
                      field={field}
                      placeholder="Enter password"
                      ariaInvalid={fieldState.invalid}
                    />
                  </Field>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
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
              Forgot Password?
            </Button>

            {/* SERVER ERROR */}
            {/* {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as any)?.response?.data?.message ||
                    "Login failed. Please try again."}
                </AlertDescription>
              </Alert>
            )} */}
          </FieldGroup>
          <div className="mt-auto">
            {/* SUBMIT */}
            <Button type="submit" className="w-full mt-7" disabled={isPending}>
              {isPending ? "Logging in..." : "Admin login"}
            </Button>
          </div>
        </form>
      </FieldSet>
    </div>
  );
}

export default LoginForm;
