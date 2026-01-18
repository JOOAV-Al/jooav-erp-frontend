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
import { useEffect } from "react";

const createBrandSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function BrandForm({
  handleSubmitForm,
  brand,
}: DialogFormProps & { brand?: BrandItem }) {
  type BrandData = z.infer<typeof createBrandSchema>;
  const form = useForm<BrandData>({
    resolver: zodResolver(createBrandSchema),
    mode: "onChange",
    defaultValues: {
      name: brand?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
  } = form;

  const onSubmit = async (values: z.infer<typeof createBrandSchema>) => {
    if (!handleSubmitForm) return;
    console.log({ brand });
    console.log({ values });
    if (brand?.id) {
      //Build partial payload using dirty fields
      const changes: Partial<BrandData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof BrandData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: brand?.id });
      return;
    }
    await handleSubmitForm(values);
  };

  useEffect(() => {
    reset({
      name: brand?.name ?? "",
    });
  }, [brand?.id, reset]);
  return (
    <form
      id="brand-form"
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
      </FieldSet>
    </form>
  );
}

export default BrandForm;
