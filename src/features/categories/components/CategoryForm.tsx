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
import { useEffect } from "react";

const createCategorySchema = z.object({
  name: z.string("Enter a valid name"),
});

export function CategoryForm({
  handleSubmitForm,
  category,
  formId = "category-form",
}: DialogFormProps & { category?: CategoryItem; formId?: string }) {
  type CategoryData = z.infer<typeof createCategorySchema>;
  const form = useForm<CategoryData>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: category?.name ?? "",
    });
  }, [category?.id, reset]);

  const onSubmit = async (values: CategoryData) => {
    if (!handleSubmitForm) return;
    console.log({ category });
    console.log({ values });
    if (category?.id) {
      //Build partial payload using dirty fields
      const changes: Partial<CategoryData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof CategoryData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: category?.id });
      return;
    }
    await handleSubmitForm(values);
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet id="" className="flex flex-1">
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
                    rightIcon={
                      category && (
                        <DiamondPlus className="h-5 w-5 text-outline-passive" />
                      )
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

export default CategoryForm;
