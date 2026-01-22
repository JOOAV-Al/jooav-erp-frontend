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
import { PackagePlus } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { ProductItem } from "@/features/products/types";
import { useEffect } from "react";

const createProductSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function ProductForm({
  handleSubmitForm,
  product,
}: DialogFormProps & { product?: ProductItem }) {
  type ProductData = z.infer<typeof createProductSchema>;
  const form = useForm<ProductData>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      name: product?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
  } = form;

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    if (!handleSubmitForm) return;
    console.log({ product });
    console.log({ values });
    if (product?.id) {
      //Build partial payload using dirty fields
      const changes: Partial<ProductData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof ProductData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: product?.id });
      return;
    }
    await handleSubmitForm(values);
  };

  useEffect(() => {
    reset({
      name: product?.name ?? "",
    });
  }, [product?.id, reset]);
  return (
    <form
      id="product-form"
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
                    <FieldLabel>Product name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter product name"
                    aria-invalid={fieldState.invalid}
                    leftIcon={
                      <PackagePlus
                        strokeWidth={2.5}
                        className="h-5 w-5 text-outline-passive"
                      />
                    }
                    isEdit={!!product}
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

export default ProductForm;
