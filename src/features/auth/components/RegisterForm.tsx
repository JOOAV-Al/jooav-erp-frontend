"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/features/auth/services/auth.api";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import PasswordInput from "@/features/auth/components/PasswordInput";
import FieldIcon from "@/components/general/FieldIcon";
import {
  Mail,
  UserRoundPen,
  UserRoundPlus,
  Phone,
  Lock,
  TypeOutline,
} from "lucide-react";
import CustomUsernameIcon from "@/components/icons/CustomUsernameIcon";
import { useUpdateDraftOrder } from "@/features/marketplace/services/marketplace.api";

const registerSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.email("Enter a valid email"),
  username: z.string().min(3, "At least 3 characters"),
  phone: z.string().min(7, "Enter a valid number"),
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

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchparams = useSearchParams();
  const fromCart = searchparams.get("fromCart");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutateAsync: register, isPending } = useRegister();
  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { data } = await register(values);

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

    router.push("/marketplace");
  };

  return (
    <div className="auth-card shadow-card flex flex-col gap-7 w-full sm:w-[420px] min-h-[530px] sm:min-h-[480px]">
      <AuthCardHeader
        header="Create account"
        description="Fill in your credentials to create an account"
      />
      <FieldSet className="flex flex-1 mt-[1.5rem]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <FieldGroup className="flex flex-col gap-7">
            {/* FIRST + LAST NAME ROW */}
            <div className="grid grid-cols-2 gap-6">
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel htmlFor="firstName">First name</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      {...field}
                      id="firstName"
                      type="text"
                      placeholder="Enter first name"
                      aria-invalid={fieldState.invalid}
                      leftIcon={<FieldIcon Icon={UserRoundPen} />}
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      {...field}
                      id="lastName"
                      type="text"
                      placeholder="Enter last name"
                      aria-invalid={fieldState.invalid}
                      leftIcon={<FieldIcon Icon={UserRoundPlus} />}
                    />
                  </Field>
                )}
              />
            </div>

            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={Mail} />}
                  />
                </Field>
              )}
            />

            {/* USERNAME */}
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={TypeOutline} />}
                  />
                </Field>
              )}
            />

            {/* WHATSAPP */}
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel htmlFor="phone">WhatsApp number</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="Enter whatsapp number"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={Phone} />}
                  />
                </Field>
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
          </FieldGroup>

          <div className="mt-auto">
            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full mt-7"
              disabled={isPending || updating}
            >
              {isPending
                ? "Creating account..."
                : updating
                  ? "Updating cart"
                  : "Create account"}
            </Button>
          </div>
        </form>
      </FieldSet>
    </div>
  );
}

export default RegisterForm;
