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
import { FolderTree, Tag } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { ParentCategoryItem } from "@/features/categories/types";
import { useEffect, useState } from "react";

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

  // State for managing existing subcategories (when editing)
  // Extract names from children array
  const [existingSubcategories, setExistingSubcategories] = useState<string[]>(
    category?.children?.map((child) => child.name) ?? [],
  );

  // Keep track of the original IDs for submission
  const [existingSubcategoryIds, setExistingSubcategoryIds] = useState<
    string[]
  >(category?.children?.map((child) => child.id) ?? []);

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
    setExistingSubcategories(
      category?.children?.map((child) => child.name) ?? [],
    );
    setExistingSubcategoryIds(
      category?.children?.map((child) => child.id) ?? [],
    );
  }, [category?.id, category?.children, reset]);

  const handleRemoveExisting = (tagToRemove: string) => {
    // Find the index of the tag to remove
    const indexToRemove = existingSubcategories.findIndex(
      (name) => name === tagToRemove,
    );

    if (indexToRemove !== -1) {
      // Remove from both arrays (names and IDs)
      setExistingSubcategories((prev) =>
        prev.filter((_, index) => index !== indexToRemove),
      );
      setExistingSubcategoryIds((prev) =>
        prev.filter((_, index) => index !== indexToRemove),
      );
    }
  };

  const onSubmit = async (values: CategoryData) => {
    if (!handleSubmitForm) return;

    // For new subcategories (just names), we'll send them as names
    // For existing ones that weren't removed, we keep their IDs
    const newSubcategoryNames = values.subcategories ?? [];

    // Build the payload
    const payload = {
      name: values.name,
      // Include both existing IDs and new names
      // Your backend should handle this appropriately
      existingSubcategoryIds: existingSubcategoryIds,
      newSubcategories: newSubcategoryNames,
    };

    console.log({ category });
    console.log({ payload });

    if (category?.id) {
      // Build partial payload using dirty fields
      const changes: any = {};

      // Check if name changed
      if (dirtyFields.name) {
        changes.name = values.name;
      }

      // Check if subcategories were modified
      const subcategoriesModified =
        newSubcategoryNames.length > 0 ||
        existingSubcategoryIds.length !== (category?.children?.length ?? 0);

      if (subcategoriesModified) {
        changes.existingSubcategoryIds = existingSubcategoryIds;
        changes.newSubcategories = newSubcategoryNames;
      }

      const finalPayload = Object.keys(changes).length > 0 ? changes : payload;
      await handleSubmitForm({ payload: finalPayload, id: category?.id });
      return;
    }

    // For creating new category, we only have names
    await handleSubmitForm({
      name: values.name,
      subcategories: newSubcategoryNames,
    });
  };

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
                    leftIcon={
                      <FolderTree
                        strokeWidth={2.5}
                        className="h-5 w-5 text-outline-passive"
                      />
                    }
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
                    leftIcon={
                      <Tag
                        strokeWidth={2.5}
                        className="h-5 w-5 text-outline-passive"
                      />
                    }
                    existingTags={existingSubcategories}
                    onRemoveExisting={handleRemoveExisting}
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
