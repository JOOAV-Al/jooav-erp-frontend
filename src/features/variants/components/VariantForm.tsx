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
import { VariantItem } from "@/features/variants/types";
import { useEffect } from "react";

const createVariantSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function VariantForm({
  handleSubmitForm,
  variant,
}: DialogFormProps & { variant?: VariantItem }) {
  type VariantData = z.infer<typeof createVariantSchema>;
  const form = useForm<VariantData>({
    resolver: zodResolver(createVariantSchema),
    mode: "onChange",
    defaultValues: {
      name: variant?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
  } = form;

  const onSubmit = async (values: z.infer<typeof createVariantSchema>) => {
    if (!handleSubmitForm) return;
    console.log({ variant });
    console.log({ values });
    if (variant?.id) {
      //Build partial payload using dirty fields
      const changes: Partial<VariantData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof VariantData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: variant?.id });
      return;
    }
    await handleSubmitForm(values);
  };

  useEffect(() => {
    reset({
      name: variant?.name ?? "",
    });
  }, [variant?.id, reset]);
  return (
    <form
      id="variant-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7">
          {/* NAME */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Variant name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter variant name"
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
      </FieldSet>
    </form>
  );
}

export default VariantForm;
