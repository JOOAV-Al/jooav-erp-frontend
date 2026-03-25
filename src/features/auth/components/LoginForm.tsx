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
import { useLogin } from "@/features/auth/services/auth.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import Cookies from "js-cookie";
import PasswordInput from "@/features/auth/components/PasswordInput";
import FieldIcon from "@/components/general/FieldIcon";
import { Eye, Mail } from "lucide-react";
import { useUpdateDraftOrder } from "@/features/marketplace/services/marketplace.api";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Must be 8 characters"),
});

type TempCartValue = {
  productId: string;
  quantity: number;
  id?: string;
  name?: string;
  price?: number;
  size?: string;
  type?: string;
  currency?: string;
};

const safeParseTempCart = (): TempCartValue | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("tempCartItem");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.productId === "string" &&
      Number(parsed.quantity) > 0
    ) {
      return parsed as TempCartValue;
    }
  } catch {
    // invalid JSON
  }
  return null;
};

export function LoginForm({
  toggleForm,
  isCustom,
  handleCustomAction,
}: {
  toggleForm?: () => void;
  isCustom?: boolean;
  handleCustomAction?: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchparams = useSearchParams();
  const fromCart = searchparams.get("fromCart");

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
  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { data } = await login(values);

    dispatch(
      setCredentials({
        user: data.data.user,
        token: data.data.accessToken,
      }),
    );

    Cookies.set("refreshToken", data.data.refreshToken);

    const tempCartItem = safeParseTempCart();
    const draftCartId = data.data.user?.wholesalerProfile?.draftCart;
    if (tempCartItem && draftCartId && fromCart === "true") {
      try {
        const payload = {
          item: {
            action: "ADD",
            productId: tempCartItem.productId,
            quantity: tempCartItem.quantity,
          },
        };
        const res = await updateDraftOrder({ payload, id: draftCartId });
        if (res?.data?.status === "success") {
          localStorage.removeItem("tempCartItem");
        }
      } catch (error) {
        // optional: toast error, but continue to redirect
        console.error("Failed to restore temp cart item:", error);
        localStorage.removeItem("tempCartItem");
      }
    }

    if (isCustom) {
      handleCustomAction?.();
    } else {
      router.push("/dashboard/orders");
    }
  };

  return (
    <div className="auth-card shadow-card flex flex-col gap-7 aspect-370/530 sm:aspect-420/530 min-h-[530px] sm:min-h-[480px] max-h-[680px]">
      <AuthCardHeader
        header="Login"
        description="Log in with your credentials."
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
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      aria-invalid={fieldState.invalid}
                      leftIcon={<FieldIcon Icon={Mail} />}
                    />
                  </Field>
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
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Password</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <PasswordInput
                      field={field}
                      placeholder="Enter password"
                      ariaInvalid={fieldState.invalid}
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
              onClick={() => {
                if (isCustom) {
                  router.push("/login");
                } else {
                  toggleForm?.();
                }
              }}
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
            <Button
              type="submit"
              className="w-full mt-7"
              disabled={isPending || updating}
            >
              {isPending
                ? "Logging in..."
                : updating
                  ? "Updating cart..."
                  : "Login"}
            </Button>
          </div>
        </form>
      </FieldSet>
    </div>
  );
}

export default LoginForm;
