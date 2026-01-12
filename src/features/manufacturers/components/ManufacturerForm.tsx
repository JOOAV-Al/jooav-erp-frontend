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
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import { useState } from "react";
import { MailIcon } from "lucide-react";
import { useCreateManufacturer } from "@/features/manufacturers/services/manufacturers.api";
import { DialogFormProps } from "@/interfaces/general";

const createManufacturerSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function ManufacturerForm({ closeDialog, loading, handleSubmitForm }: DialogFormProps) {
  const [message, setMessage] = useState<string>("");
  
    const { mutateAsync: createManufacturer, isPending } =
      useCreateManufacturer();

  const form = useForm<z.infer<typeof createManufacturerSchema>>({
    resolver: zodResolver(createManufacturerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof createManufacturerSchema>) => {
    if (handleSubmitForm) {
      await handleSubmitForm(values);
      return;
    }

    // fallback local behaviour
    const response = await createManufacturer(values);
    setMessage(response?.data?.message);
    if (closeDialog) closeDialog();
  };

  return (
    <FieldSet className="flex flex-1">
      <form
        id="manufacturer-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1"
      >
        <FieldGroup className="flex flex-col gap-7">
          {/* NAME */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your name"
                    aria-invalid={fieldState.invalid}
                    leftIcon={<MailIcon className="h-4 w-4" />}
                  />
                </Field>
              </div>
            )}
          />
        </FieldGroup>
          {/* internal submit (kept for smaller screens or when footer not used) */}
        {/* <div className="mt-auto">
          <Button type="submit" className="w-full mt-7" disabled={loading}>
            {loading ? "Loading..." : "Create"}
          </Button>
        </div> */}
      </form>
    </FieldSet>
  );
}

export default ManufacturerForm;
