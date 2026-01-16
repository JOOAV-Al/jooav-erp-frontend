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
import { ProductItem } from "@/features/products/types";

const createProductSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function ProductForm({
  handleSubmitForm,
  product,
}: DialogFormProps & { product?: ProductItem }) {
  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      name: product?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    if (handleSubmitForm) {
      await handleSubmitForm(values);
      return;
    }
    console.log(values);
  };

  return (
    <FieldSet className="flex flex-1">
      <form
        id="product-form"
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

export default ProductForm;
