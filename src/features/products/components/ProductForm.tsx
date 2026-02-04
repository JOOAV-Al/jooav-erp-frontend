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
import {
  DollarSign,
  GitBranch,
  GitBranchPlus,
  GitFork,
  Package,
  PackageOpen,
  PackagePlus,
  PackageSearch,
  Workflow,
} from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { ProductItem } from "@/features/products/types";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useGetBrands } from "@/features/brands/services/brands.api";
import { useGetVariants } from "@/features/variants/services/variants.api";
import {
  useGetCategories,
  useGetCategoriesTree,
} from "@/features/categories/services/category.api";
import { Select } from "@/components/general/Select";
import FormGroupName from "@/components/general/FormGroupName";
import FieldIcon from "@/components/general/FieldIcon";
// import Naira from "/dashboard/N.svg"
import Image from "next/image";
import { ImageUploadBox } from "@/components/general/ImageUploadBox";
import { VariantItem } from "@/features/variants/types";
import { ParentCategoryItem } from "@/features/categories/types";

export function ProductForm({
  handleSubmitForm,
  product,
}: DialogFormProps & { product?: ProductItem }) {
  const [selectedVariant, setSelectedVariant] = useState<
    VariantItem | undefined
  >();
  const [selectedCategory, setSelectedCategory] = useState<
    ParentCategoryItem | undefined
  >();
  const { data: brands } = useGetBrands({});
  const { data: categories } = useGetCategories({});

  const createProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().min(1, "description is required"),
    brandId: z.string().min(1, "brand is required"),
    variantId: z.string().min(1, "variant is required"),
    categoryId: z.string().min(1, "category is required"),
    sku: z.string().optional(),
    subcategoryId: z.string().min(1, "subcategory is required"),
    packTypeId: z.string().min(1, "pack type is required"),
    packSizeId: z.string().min(1, "pack size is required"),
    price: z.number().min(0, "Enter Price"),
    // discount: z.number().min(0, "Enter discount"),
    thumbnail: z.any().optional(),
    images: z.any().optional(),
  });

  type ProductData = z.infer<typeof createProductSchema>;
  const form = useForm<ProductData>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      brandId: product?.brandId ?? "",
      variantId: product?.variantId ?? "",
      packSizeId: product?.packSizeId ?? "",
      packTypeId: product?.packTypeId ?? "",
      sku: product?.sku ?? "",
      categoryId: product?.categoryId ?? "",
      subcategoryId: product?.subcategoryId ?? "",
      price: (product?.price && product?.price) || undefined,
      thumbnail: (product?.thumbnail && product?.thumbnail) || undefined,
      images: product?.images ?? [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    watch,
    reset,
  } = form;

  const watchedBrand = watch("brandId");
  const { data: variants } = useGetVariants({ brandId: watchedBrand });

  //Update pack size and pack type data
  const watchedVariant = watch("variantId");
  useEffect(() => {
    if (!watchedVariant || !variants) return;
    const variant = variants?.data?.find((v) => v.id === watchedVariant);
    setSelectedVariant(variant);
  }, [watchedVariant, variants]);

  //Update pack size and pack type data
  const watchedCategory = watch("categoryId");
  useEffect(() => {
    if (!watchedCategory || !categories) return;
    const category = categories?.data?.find((v) => v.id === watchedCategory);
    setSelectedCategory(category);
  }, [watchedCategory, categories]);

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
          if (typeof val === "number") {
            if (key === "price") changes.price = val;
          } else if (typeof val === "string" && key !== "price") {
            changes[key] = val;
          }
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: product?.id });
      return;
    }
    const { thumbnail, images, name, sku, categoryId, ...rest } = values;
    await handleSubmitForm(rest);
  };

  useEffect(() => {
    reset({
      name: product?.name ?? "",
      description: product?.description ?? "",
      brandId: product?.brandId ?? "",
      variantId: product?.variantId ?? "",
      packSizeId: product?.packSizeId ?? "",
      packTypeId: product?.packTypeId ?? "",
      sku: product?.sku ?? "",
      categoryId: product?.categoryId ?? "",
      subcategoryId: product?.subcategoryId ?? "",
      price: (product?.price && product?.price) || undefined,
      // thumbnail: product?.thumbnail ?? "",
      images: product?.images ?? [],
    });
  }, [product?.id, reset]);

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className=" grid grid-cols-1 lg:grid-cols-2 gap-x-7">
        <div className="flex flex-col gap-lg pt-main lg:pb-main">
          <FieldGroup className="flex flex-col gap-sm">
            <FormGroupName name="OVERVIEW" />
            <div className="flex flex-col gap-7">
              {/* NAME */}
              {!!product && (
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <div>
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex gap-3 items-center">
                          <FieldLabel>Product name</FieldLabel>
                          {fieldState.error && (
                            <FieldError>
                              : {fieldState.error.message}
                            </FieldError>
                          )}
                        </div>
                        <Input
                          disabled
                          {...field}
                          type="text"
                          placeholder="Enter product name"
                          aria-invalid={fieldState.invalid}
                          leftIcon={<FieldIcon Icon={Package} />}
                          isEdit={!!product}
                        />
                      </Field>
                    </div>
                  )}
                />
              )}

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Product description</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Textarea
                        {...field}
                        placeholder="Enter product description"
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </div>
                )}
              />
            </div>
          </FieldGroup>

          <FieldGroup className="flex flex-col gap-sm">
            <FormGroupName name="CORE ENTITIES" />
            <div className="flex flex-col gap-7">
              <Controller
                control={control}
                name="brandId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Select brand</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        options={
                          brands?.data?.map((m) => ({
                            label: m.name,
                            value: m.id,
                          })) || []
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Select brand"
                        searchable
                        leftIcon={<FieldIcon Icon={GitBranch} />}
                      />
                    </Field>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="variantId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Select variant</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        options={
                          variants?.data?.map((m) => ({
                            label: m.name,
                            value: m.id,
                          })) || []
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Select product variant"
                        searchable
                        leftIcon={<FieldIcon Icon={Workflow} />}
                      />
                    </Field>
                  </div>
                )}
              />
            </div>
          </FieldGroup>

          <FieldGroup className="flex flex-col gap-sm">
            <FormGroupName name="PACK CONFIGURATION" />
            <div className="flex flex-col gap-7">
              <Controller
                control={control}
                name="packSizeId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Select pack size</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        options={
                          selectedVariant?.packSizes?.map((m) => ({
                            label: m.name,
                            value: m.id,
                          })) || []
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Select product pack size"
                        searchable
                        leftIcon={<FieldIcon Icon={PackageOpen} />}
                      />
                    </Field>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="packTypeId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Select pack type</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        options={
                          selectedVariant?.packTypes?.map((m) => ({
                            label: m.name,
                            value: m.id,
                          })) || []
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Select product pack type"
                        searchable
                        leftIcon={<FieldIcon Icon={PackageSearch} />}
                      />
                    </Field>
                  </div>
                )}
              />
              {!!product && (
                <Controller
                  control={control}
                  name="sku"
                  render={({ field, fieldState }) => (
                    <div>
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex gap-3 items-center">
                          <FieldLabel>SKU</FieldLabel>
                          {fieldState.error && (
                            <FieldError>
                              : {fieldState.error.message}
                            </FieldError>
                          )}
                        </div>
                        <Input
                          disabled
                          {...field}
                          type="text"
                          placeholder="Product SKU"
                          aria-invalid={fieldState.invalid}
                          // leftIcon={<FieldIcon Icon={Package} />}
                          isEdit={!!product}
                        />
                      </Field>
                    </div>
                  )}
                />
              )}
            </div>
          </FieldGroup>

          <FieldGroup className="flex flex-col gap-sm">
            <FormGroupName name="PRODUCT CATEGORY" />
            <div className="flex flex-col gap-7">
              <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Select category</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        options={
                          categories?.data?.map((m) => ({
                            label: m.name,
                            value: m.id,
                          })) || []
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Select product category"
                        searchable
                        leftIcon={<FieldIcon Icon={GitBranchPlus} />}
                      />
                    </Field>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="subcategoryId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <div>
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex gap-3 items-center">
                        <FieldLabel>Select subcategory</FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        options={
                          selectedCategory?.subcategories?.map((m) => ({
                            label: m.name,
                            value: m.id,
                          })) || []
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Select product subcategory"
                        searchable
                        leftIcon={<FieldIcon Icon={GitFork} />}
                      />
                    </Field>
                  </div>
                )}
              />
            </div>
          </FieldGroup>
        </div>

        <div className="flex flex-col gap-lg lg:pt-main lg:pb-main">
          <FieldGroup className="flex flex-col gap-7">
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Price</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      // {...field}
                      type="number"
                      placeholder="0.00"
                      aria-invalid={fieldState.invalid}
                      leftIcon={
                        <Image
                          src={"/dashboard/N.svg"}
                          width={16}
                          height={16}
                          alt="Naira"
                        />
                      }
                      isEdit={!!product}
                      defaultValue={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </Field>
                </div>
              )}
            />
            <Controller
              control={control}
              name="thumbnail"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Product thumbnail</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>

                  <ImageUploadBox
                    value={field.value ?? product?.thumbnail}
                    onChange={field.onChange}
                    width={96}
                    height={96}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="images"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Product Images</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {field.value?.map((img: File | string, index: number) => (
                      <ImageUploadBox
                        key={index}
                        value={img}
                        onChange={(file) => {
                          const copy = [...field.value];
                          if (file) copy[index] = file;
                          field.onChange(copy);
                        }}
                        width={160}
                        height={160}
                      />
                    ))}

                    <ImageUploadBox
                      onChange={(file) => {
                        if (!file) return;
                        field.onChange([...(field.value || []), file]);
                      }}
                      width={160}
                      height={160}
                    />
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </FieldSet>
    </form>
  );
}

export default ProductForm;
