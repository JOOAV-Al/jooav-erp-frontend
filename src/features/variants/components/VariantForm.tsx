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
import { GitBranchPlus, Tag, Tags, Workflow } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import {
  CreateVariantPayload,
  VariantItem,
  VariantPackSize,
  VariantPackType,
} from "@/features/variants/types";
import { useEffect, useRef, useState } from "react";
import { Select } from "@/components/general/Select";
// import { useGetBrands } from "@/features/brands/services/brands.api";
import { TagInput, TagInputHandle } from "@/components/ui/TagInput";
import FieldIcon from "@/components/general/FieldIcon";
import FormGroupName from "@/components/general/FormGroupName";
import { BrandItem } from "@/features/brands/types";

const createVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  brandId: z.string().min(1, "Brand is required"),
  packSizes: z.array(z.string()).optional(),
  packTypes: z.array(z.string()).optional(),
});

export function VariantForm({
  handleSubmitForm,
  variant,
  brands,
  onResetReady,
}: DialogFormProps & { variant?: VariantItem; brands?: BrandItem[] }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const { data: brands } = useGetBrands({});

  // Track existing pack sizes and types (from backend)
  const [existingPackSizes, setExistingPackSizes] = useState<VariantPackSize[]>(
    variant?.packSizes ?? [],
  );
  const [existingPackTypes, setExistingPackTypes] = useState<VariantPackType[]>(
    variant?.packTypes ?? [],
  );
  const [pendingPackSizes, setPendingPackSizes] = useState<string[]>([]);
  const [pendingPackTypes, setPendingPackTypes] = useState<string[]>([]);

  // Track which existing ones to delete
  const [packSizesToDelete, setPackSizesToDelete] = useState<string[]>([]);
  const [packTypesToDelete, setPackTypesToDelete] = useState<string[]>([]);

  const packSizesInputRef = useRef<TagInputHandle>(null);
  const packTypesInputRef = useRef<TagInputHandle>(null);

  type VariantData = z.infer<typeof createVariantSchema>;
  const form = useForm<VariantData>({
    resolver: zodResolver(createVariantSchema),
    mode: "onChange",
    defaultValues: {
      name: variant?.name ?? "",
      brandId: variant?.brandId ?? "",
      packSizes: [],
      packTypes: [],
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
      name: variant?.name ?? "",
      brandId: variant?.brandId ?? "",
      packSizes: [],
      packTypes: [],
    });
    setExistingPackSizes(variant?.packSizes ?? []);
    setExistingPackTypes(variant?.packTypes ?? []);
    setPackSizesToDelete([]);
    setPackTypesToDelete([]);
    setPendingPackSizes([]);
    setPendingPackTypes([]);
  }, [variant?.id, reset]);

  useEffect(() => {
    onResetReady?.(() => {
      reset({
        name: variant?.name ?? "",
        brandId: variant?.brandId ?? "",
        packSizes: [],
        packTypes: [],
      });
      setExistingPackSizes(variant?.packSizes ?? []);
      setExistingPackTypes(variant?.packTypes ?? []);
      setPackSizesToDelete([]);
      setPackTypesToDelete([]);
      setPendingPackSizes([]);
      setPendingPackTypes([]);
      packSizesInputRef.current?.clear();
      packTypesInputRef.current?.clear();
    });
  }, [variant?.id, reset]);

  const handleRemoveExistingSize = (name: string) => {
    const itemToRemove = existingPackSizes.find((item) => item.name === name);
    if (itemToRemove) {
      setPackSizesToDelete((prev) => [...prev, itemToRemove.id]);
      setExistingPackSizes((prev) =>
        prev.filter((item) => item.id !== itemToRemove.id),
      );
    }
  };

  const handleRemoveExistingType = (name: string) => {
    const itemToRemove = existingPackTypes.find((item) => item.name === name);
    if (itemToRemove) {
      setPackTypesToDelete((prev) => [...prev, itemToRemove.id]);
      setExistingPackTypes((prev) =>
        prev.filter((item) => item.id !== itemToRemove.id),
      );
    }
  };

  const handleConfirmSizes = (tags: string[]) => {
    setPendingPackSizes((prev) => {
      const merged = [...prev, ...tags.filter((t) => !prev.includes(t))];
      form.setValue("packSizes", merged); // ✅ uses the same merged array
      return merged;
    });
  };

  const handleConfirmTypes = (tags: string[]) => {
    setPendingPackTypes((prev) => {
      const merged = [...prev, ...tags.filter((t) => !prev.includes(t))];
      form.setValue("packTypes", merged); // ✅ uses the same merged array
      return merged;
    });
  };

  const handleRemovePendingSize = (tag: string) => {
    const updated = pendingPackSizes.filter((t) => t !== tag);
    setPendingPackSizes(updated);
    form.setValue("packSizes", updated);
  };

  const handleRemovePendingType = (tag: string) => {
    const updated = pendingPackTypes.filter((t) => t !== tag);
    setPendingPackTypes(updated);
    form.setValue("packTypes", updated);
  };

  const onSubmit = async (values: VariantData) => {
    if (!handleSubmitForm) return;

    const newPackSizes = values.packSizes ?? [];
    const newPackTypes = values.packTypes ?? [];

    if (variant?.id) {
      // EDITING MODE
      const payload: CreateVariantPayload = {};

      // Only include name if it changed
      if (dirtyFields.name) {
        payload.name = values.name;
      }

      // Only include brandId if it changed
      if (dirtyFields.brandId) {
        payload.brandId = values.brandId;
      }

      // Handle pack sizes
      if (newPackSizes.length > 0) {
        payload.createPackSizes = newPackSizes.map((name) => ({ name }));
      }
      if (packSizesToDelete.length > 0) {
        payload.deletePackSizeIds = packSizesToDelete;
      }

      // Handle pack types
      if (newPackTypes.length > 0) {
        payload.createPackTypes = newPackTypes.map((name) => ({ name }));
      }
      if (packTypesToDelete.length > 0) {
        payload.deletePackTypeIds = packTypesToDelete;
      }

      await handleSubmitForm({ payload, id: variant.id });
    } else {
      // CREATING MODE
      const payload: any = {
        name: values.name,
        brandId: values.brandId,
      };

      if (newPackSizes.length > 0) {
        payload.packSizes = newPackSizes.map((name) => ({ name }));
      }
      if (newPackTypes.length > 0) {
        payload.packTypes = newPackTypes.map((name) => ({ name }));
      }

      await handleSubmitForm(payload);
    }
  };

  return (
    <form
      id="variant-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1 flex-col gap-lg pb-6">
        <FieldGroup className="flex flex-col gap-7">
          {/* VARIANT NAME */}
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
                    leftIcon={<FieldIcon Icon={Workflow} />}
                    isEdit={!!variant}
                  />
                </Field>
              </div>
            )}
          />

          {/* BRAND */}
          <Controller
            control={control}
            name="brandId"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel dimLabel={dropdownOpen}>Brand</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    isOpen={dropdownOpen}
                    setIsOpen={setDropdownOpen}
                    options={
                      brands?.map((m) => ({
                        label: m.name,
                        value: m.id,
                      })) || []
                    }
                    value={value}
                    onChange={onChange}
                    placeholder="Select brand"
                    searchable
                    leftIcon={<FieldIcon Icon={GitBranchPlus} />}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </div>
            )}
          />
        </FieldGroup>

        <FieldGroup className="flex flex-col gap-sm">
          <FormGroupName name="PACK CONFIGURATIONS" />
          <div className="flex flex-col gap-7">
            {/* PACK SIZES */}
            <Controller
              control={control}
              name="packSizes"
              render={({ field: { onChange, value }, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Pack size</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <TagInput
                      ref={packSizesInputRef}
                      value={value}
                      // onChange={onChange}
                      onChange={() => {}}
                      onConfirm={handleConfirmSizes}
                      placeholder="Add pack size"
                      leftIcon={<FieldIcon Icon={Tag} />}
                      // existingTags={existingPackSizes.map((item) => item.name)}
                      existingTags={[
                        ...existingPackSizes.map((item) => item.name),
                        ...pendingPackSizes,
                      ]}
                      // onRemoveExisting={handleRemoveExistingSize}
                      onRemoveExisting={(tag) => {
                        // Check if it's a pending (new) one or a real existing one
                        if (pendingPackSizes.includes(tag)) {
                          handleRemovePendingSize(tag);
                        } else {
                          handleRemoveExistingSize(tag);
                        }
                      }}
                    />
                  </Field>
                </div>
              )}
            />

            {/* PACK TYPES */}
            <Controller
              control={control}
              name="packTypes"
              render={({ field: { onChange, value }, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Pack type</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <TagInput
                      ref={packTypesInputRef}
                      value={value}
                      // onChange={onChange}
                      onChange={() => {}}
                      onConfirm={handleConfirmTypes}
                      placeholder="Add pack type"
                      leftIcon={<FieldIcon Icon={Tags} />}
                      existingTags={[
                        ...existingPackTypes.map((item) => item.name),
                        ...pendingPackTypes,
                      ]}
                      onRemoveExisting={(tag) => {
                        if (pendingPackTypes.includes(tag)) {
                          handleRemovePendingType(tag);
                        } else {
                          handleRemoveExistingType(tag);
                        }
                      }}
                    />
                  </Field>
                </div>
              )}
            />
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default VariantForm;
