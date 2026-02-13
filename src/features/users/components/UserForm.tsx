"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MailIcon,
  Phone,
  ShieldUser,
  UserRoundPen,
  UserRoundPlus,
} from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { UserItem } from "@/features/users/types";
import { useEffect, useState } from "react";
import { Select } from "@/components/general/Select";
import FieldIcon from "@/components/general/FieldIcon";
import { userRoles } from "@/lib/rbac/roles";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import CopyLinkBox from "@/components/general/CopyLinkBox";
import Image from "next/image";

const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Second name is required"),
  email: z.email("Email is required"),
  // phone: z.string().min(10, "Phone is required"),
  phone: z.string().refine((val) => {
    return isValidPhoneNumber(val, "NG");
  }, "Invalid Phone Number"),
  role: z.string().min(1, "user role is required"),
});

export function UserForm({
  handleSubmitForm,
  user,
}: DialogFormProps & { user?: UserItem }) {
  const [linkGenerated, setLinkGenerated] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  type UserData = z.infer<typeof createUserSchema>;
  const form = useForm<UserData>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      role: user?.role ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
    setValue,
  } = form;

  const handleLinkRequest = () => {
    setLink("https://google.com")
    setLinkGenerated(true)
  }

  const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
    if (!handleSubmitForm) return;

    if (user?.id) {
      // Build partial payload using dirty fields
      const changes: Partial<UserData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof UserData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: user?.id });
      setLinkGenerated(false)
      return;
    }
    await handleSubmitForm(values);
  };

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      role: user?.role ?? "",
    });
  }, [user?.id, reset]);

  return (
    <form
      id="user-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7 pb-12">
          {/* FIRST NAME */}
          <Controller
            control={control}
            name="firstName"
            render={({ field, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>First name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter first name"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={UserRoundPen} />}
                    isEdit={!!user}
                  />
                </Field>
              </div>
            )}
          />

          {/* LAST NAME */}
          <Controller
            control={control}
            name="lastName"
            render={({ field, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Second name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter second name"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={UserRoundPlus} />}
                    isEdit={!!user}
                  />
                </Field>
              </div>
            )}
          />

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
                    placeholder="Enter email"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={MailIcon} />}
                  />
                </Field>
              </div>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Phone number</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter phone number"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<FieldIcon Icon={Phone} />}
                    isEdit={!!user}
                  />
                </Field>
              </div>
            )}
          />

          {/* MANUFACTURER */}
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>User role</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    options={
                      userRoles?.map((r) => ({
                        label: r.label,
                        value: r.value,
                      })) || []
                    }
                    value={value}
                    onChange={onChange}
                    placeholder="Select role"
                    searchable
                    leftIcon={<FieldIcon Icon={ShieldUser} />}
                  />
                </Field>
              </div>
            )}
          />

          {user && (
            <>
              {linkGenerated && link ? (
                <CopyLinkBox
                  onShare={() => {
                    console.log("share");
                  }}
                  link={link}
                  shareBtnIcon={
                    <Image
                      src={"/dashboard/whatsApp.svg"}
                      width={16}
                      height={16}
                      alt="Naira"
                    />
                  }
                />
              ) : (
                <div className="py-sm gap-main flex flex-col">
                  <div className={`flex flex-col gap-5 ${`py-sm`}`}>
                    <h4 className="leading-[1.2] tracking-[0.01]">
                      Reset user credentials
                    </h4>
                    <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03]">
                      {"Click the button to generate a link to"}
                    </p>
                  </div>
                  <Button
                    type={"button"}
                    size={"neutral"}
                    variant="input"
                    onClick={handleLinkRequest}
                    className="shadow-input! font-semibold w-fit"
                  >
                    {/* <span className="px-2">{shareBtnIcon && shareBtnIcon}</span> */}
                    <span className="px-2 py-4 text-[#FF803F]">
                      Generate login link
                    </span>
                  </Button>
                </div>
              )}
            </>
          )}
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default UserForm;
