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
import { TagInput } from "@/components/ui/TagInput";
import { Folders, FolderTree } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import {
  CategoryItem,
  CreateCategoryPayload,
  ParentCategoryItem,
} from "@/features/categories/types";
import { useEffect, useState } from "react";
import FieldIcon from "@/components/general/FieldIcon";
import FormGroupName from "@/components/general/FormGroupName";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  subcategories: z.array(z.string()).optional(),
});

export function CategoryForm({
  handleSubmitForm,
  category,
  formId = "category-form",
}: DialogFormProps & { category?: ParentCategoryItem; formId?: string }) {
  type CategoryData = z.infer<typeof createCategorySchema>;

  const [existingSubcategories, setExistingSubcategories] = useState<
    CategoryItem[]
  >(category?.subcategories ?? []);

  const [subcategoriesToDelete, setSubcategoriesToDelete] = useState<string[]>(
    [],
  );
  const form = useForm<CategoryData>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
      subcategories: [],
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
      subcategories: [],
    });
    setExistingSubcategories(category?.subcategories ?? []);
    setSubcategoriesToDelete([]);
  }, [category?.id, reset]);

  const handleRemoveExistingCategory = (name: string) => {
    const itemToRemove = existingSubcategories.find(
      (item) => item.name === name,
    );
    if (itemToRemove) {
      setSubcategoriesToDelete((prev) => [...prev, itemToRemove.id]);
      setExistingSubcategories((prev) =>
        prev.filter((item) => item.id !== itemToRemove.id),
      );
    }
  };
  const onSubmit = async (values: CategoryData) => {
    if (!handleSubmitForm) return;
    const newSubcategoryNames = values.subcategories ?? [];

    if (category?.id) {
      // EDITING MODE
      const payload: CreateCategoryPayload = {};

      // Only include name if it changed
      if (dirtyFields.name) {
        payload.name = values.name;
      }

      // Handle pack categories
      if (newSubcategoryNames.length > 0) {
        payload.createSubcategories = newSubcategoryNames.map((name) => ({
          name,
        }));
      }
      if (subcategoriesToDelete.length > 0) {
        payload.deleteSubcategoryIds = subcategoriesToDelete;
      }

      await handleSubmitForm({ payload, id: category.id });
    } else {
      // CREATING MODE
      const payload: any = {
        name: values.name,
      };

      if (newSubcategoryNames.length > 0) {
        payload.subcategories = newSubcategoryNames.map((name) => ({ name }));
      }

      await handleSubmitForm(payload);
    }
  };

  console.log(form?.getValues());
  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7">
          {/* CATEGORY NAME */}
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
                    leftIcon={<FieldIcon Icon={FolderTree} />}
                    isEdit={!!category}
                  />
                </Field>
              </div>
            )}
          />

          {/* SUBCATEGORIES */}
          <Controller
            control={control}
            name="subcategories"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Sub-category name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <TagInput
                    value={value}
                    onChange={onChange}
                    placeholder="Add sub-category"
                    leftIcon={<FieldIcon Icon={Folders} />}
                    existingTags={existingSubcategories.map(
                      (item) => item.name,
                    )}
                    onRemoveExisting={handleRemoveExistingCategory}
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
