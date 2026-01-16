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
import { CategoryItem } from "@/features/categories/types";

const createCategorySchema = z.object({
  name: z.string("Enter a valid name"),
});

export function CategoryForm({
  handleSubmitForm,
  category,
}: DialogFormProps & { category?: CategoryItem }) {
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof createCategorySchema>) => {
    if (handleSubmitForm) {
      await handleSubmitForm(values);
      return;
    }
    console.log(values);
  };

  return (
    <FieldSet className="flex flex-1">
      <form
        id="category-form"
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
                    <FieldLabel>Category name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter category name"
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

export default CategoryForm;
