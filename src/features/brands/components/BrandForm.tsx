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
import { DiamondPlus } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { BrandItem } from "@/features/brands/types";

const createBrandSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function BrandForm({
  handleSubmitForm,
  brand
}: DialogFormProps & {brand?: BrandItem}) {
  const form = useForm<z.infer<typeof createBrandSchema>>({
    resolver: zodResolver(createBrandSchema),
    mode: "onChange",
    defaultValues: {
      name: brand?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof createBrandSchema>) => {
    if (handleSubmitForm) {
      await handleSubmitForm(values);
      return;
    }
    console.log(values);
  };

  return (
    <FieldSet className="flex flex-1">
      <form
        id="brand-form"
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
                    <FieldLabel>Brand name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter brand name"
                    aria-invalid={fieldState.invalid}
                    leftIcon={
                      <DiamondPlus className="h-5 w-5 text-outline-passive" />
                    }
                  />
                </Field>
              </div>
            )}
          />
        </FieldGroup>
      </form>
    </FieldSet>
  );
}

export default BrandForm;
