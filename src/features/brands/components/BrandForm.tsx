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
import { DiamondPlus, Package, PenLine } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { BrandItem } from "@/features/brands/types";
import { useEffect, useState } from "react";
import { Select } from "@/components/general/Select";
import { FileInput } from "@/components/ui/FileInput";
// import { useGetManufacturers } from "@/features/manufacturers/services/manufacturers.api";
import FieldIcon from "@/components/general/FieldIcon";
import { ManufacturerItem } from "@/features/manufacturers/types";

const createBrandSchema = z.object({
  logo: z.any().optional(),
  name: z.string().min(1, "Brand name is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
});

export function BrandForm({
  handleSubmitForm,
  brand,
  manufacturers
}: DialogFormProps & { brand?: BrandItem; manufacturers?: ManufacturerItem[] }) {
  type BrandData = z.infer<typeof createBrandSchema>;
  const [logoFileName, setLogoFileName] = useState<string>("");
  // const { data: manufacturers } = useGetManufacturers({});
  const form = useForm<BrandData>({
    resolver: zodResolver(createBrandSchema),
    mode: "onChange",
    defaultValues: {
      name: brand?.name ?? "",
      manufacturerId: brand?.manufacturerId ?? "",
      logo: null,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
    setValue,
  } = form;

  const onSubmit = async (values: z.infer<typeof createBrandSchema>) => {
    if (!handleSubmitForm) return;
    console.log({ brand });
    console.log({ values });

    if (brand?.id) {
      // Build partial payload using dirty fields
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
      manufacturerId: brand?.manufacturerId ?? "",
      logo: null,
    });
    // If editing and brand has logo filename, set it
    if (brand?.logo) {
      setLogoFileName(brand?.logo?.split("/")?.[10] ?? "");
    }
  }, [brand?.id, reset]);

  return (
    <form
      id="brand-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7 pb-12">
          {/* BRAND LOGO */}
          <Controller
            control={control}
            name="logo"
            render={({ field: { onChange, value, ...field }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Brand logo</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <FileInput
                    {...field}
                    accept="image/*"
                    fileName={logoFileName}
                    onFileSelect={(file) => {
                      onChange(file);
                      if (file) {
                        setLogoFileName(file.name);
                      }
                    }}
                    onClear={() => {
                      onChange(null);
                      setLogoFileName("");
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </div>
            )}
          />

          {/* BRAND NAME */}
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
                    leftIcon={<FieldIcon Icon={DiamondPlus} />}
                    isEdit={!!brand}
                  />
                </Field>
              </div>
            )}
          />

          {/* MANUFACTURER */}
          <Controller
            control={control}
            name="manufacturerId"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Manufacturer name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    options={
                      manufacturers?.map((m) => ({
                        label: m.name,
                        value: m.id,
                      })) || []
                    }
                    value={value}
                    onChange={onChange}
                    placeholder="Select manufacturer"
                    searchable
                    leftIcon={<FieldIcon Icon={Package} />}
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
