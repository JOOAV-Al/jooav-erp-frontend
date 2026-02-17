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
  GitBranch,
  GitBranchPlus,
  GitFork,
  Package,
  PackageOpen,
  PackageSearch,
  Workflow,
} from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { ProductItem } from "@/features/products/types";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useGetVariants } from "@/features/variants/services/variants.api";
// import { useGetCategories } from "@/features/categories/services/category.api";
import { Select } from "@/components/general/Select";
import FormGroupName from "@/components/general/FormGroupName";
import FieldIcon from "@/components/general/FieldIcon";
// import Naira from "/dashboard/N.svg"
import Image from "next/image";
import { ImageUploadBox } from "@/components/general/ImageUploadBox";
import { VariantItem } from "@/features/variants/types";
import { ParentCategoryItem } from "@/features/categories/types";
import { BrandItem } from "@/features/brands/types";
import { useProductDraft } from "@/features/products/hooks/useProductDraft";
import { setTimeout } from "timers/promises";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "description is required"),
  brandId: z.string().min(1, "brand is required"),
  variantId: z.string().min(1, "variant is required"),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "category is required"),
  subcategoryId: z.string().min(1, "subcategory is required"),
  packTypeId: z.string().min(1, "pack type is required"),
  packSizeId: z.string().min(1, "pack size is required"),
  price: z.number().min(0, "Enter Price"),
  // discount: z.number().min(0, "Enter discount"),
  thumbnail: z.any().optional(),
  images: z.array(z.any()).optional(),
});

export function ProductForm({
  handleSubmitForm,
  product,
  submitAction = "primary",
  brands,
  categories,
}: DialogFormProps & {
  product?: ProductItem;
  brands?: BrandItem[];
  categories?: ParentCategoryItem[];
}) {
  const isEditMode = !!product?.id;
  const [selectedVariant, setSelectedVariant] = useState<
    VariantItem | undefined
  >();
  const [selectedCategory, setSelectedCategory] = useState<
    ParentCategoryItem | undefined
  >();
  //Track existing images and deletions
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images ?? [],
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [shouldDeleteThumbnail, setShouldDeleteThumbnail] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  type ProductData = z.infer<typeof createProductSchema>;
  const EMPTY_VALUES: ProductData = {
    name: "",
    description: "",
    brandId: "",
    variantId: "",
    packSizeId: "",
    packTypeId: "",
    sku: "",
    categoryId: "",
    subcategoryId: "",
    price: undefined as any,
    thumbnail: undefined,
    images: [],
  };
  const form = useForm<ProductData>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    watch,
    reset,
  } = form;

  // ─ Draft system (create mode only) ────────────────────────────────────────
  const { clearDraft, discardDraft, hasDraft, readDraft } = useProductDraft(
    form,
    isEditMode,
  );

  // Show the "draft restored" banner once on mount if there's a saved draft
  // useEffect(() => {
  //   if (!isEditMode && hasDraft()) {
  //     setShowDraftBanner(true);
  //   }
  // }, []);

  //─ Reset when switching between create / edit ──────────────────────────────
  useEffect(() => {
    if (isEditMode) {
      reset({
        name: product?.name ?? "",
        description: product?.description ?? "",
        brandId: product?.brandId ?? "",
        variantId: product?.variantId ?? "",
        packSizeId: product?.packSizeId ?? "",
        packTypeId: product?.packTypeId ?? "",
        sku: product?.sku ?? "",
        categoryId: product?.subcategory?.category?.id ?? "",
        subcategoryId: product?.subcategoryId ?? "",
        price: Number(product?.price) || undefined,
        images: [],
      });
      setExistingImages(product?.images ?? []);
      setImagesToDelete([]);
      setShouldDeleteThumbnail(false);
      setShowDraftBanner(false);
    } else {
      // Create mode: check for a draft first, use it if present
      const draft = readDraft();
      if (draft) {
        reset({
          ...EMPTY_VALUES,
          ...draft,
          // Files can't be serialised — always start empty
          thumbnail: undefined,
          images: [],
        });
        setShowDraftBanner(true);
      } else {
        reset(EMPTY_VALUES);
        setShowDraftBanner(false);
      }
      setExistingImages([]);
      setImagesToDelete([]);
      setShouldDeleteThumbnail(false);
    }
  }, [product?.id, isEditMode]);

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
    const category = categories?.find((v) => v.id === watchedCategory);
    setSelectedCategory(category);
  }, [watchedCategory, categories]);

  const handleRemoveExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    if (!handleSubmitForm) return;
    // Determine status based on which button was clicked
    const status = submitAction === "secondary" ? "LIVE" : "QUEUE";
    // Build FormData
    const formData = new FormData();

    // Add text fields
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("brandId", values.brandId);
    formData.append("variantId", values.variantId);
    formData.append("subcategoryId", values.subcategoryId);
    formData.append("packTypeId", values.packTypeId);
    formData.append("packSizeId", values.packSizeId);
    formData.append("status", status);
    formData.append("price", values.price.toString());

    if (product?.id) {
      // EDITING MODE

      // Handle thumbnail
      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }
      if (shouldDeleteThumbnail) {
        formData.append("deleteThumbnail", "true");
      }

      // Handle images - append each file individually
      const newImages = (values.images ?? []).filter(
        (img): img is File => img instanceof File,
      );
      newImages.forEach((file) => {
        formData.append("createImages", file);
      });

      // Track deleted images
      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach((url) => {
          formData.append("deleteImages", url);
        });
        // formData.append("deleteImages", JSON.stringify(imagesToDelete));
      }

      await handleSubmitForm({ payload: formData, id: product.id });
    } else {
      // CREATING MODE

      // Handle thumbnail
      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }

      // Handle images - append each file individually
      const imageFiles = (values.images ?? []).filter(
        (img): img is File => img instanceof File,
      );
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await handleSubmitForm(formData);
      // Clear the draft only after a successful create
      clearDraft();
      setShowDraftBanner(false)
    }
  };

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      {/* ── Draft restored banner ── */}
      {showDraftBanner && !isEditMode && (
        <div className="mx-xl mb-main flex items-center justify-between gap-4 rounded-lg border border-border-brand-stroke bg-tag-added px-md py-sm text-sm">
          <span className="text-brand-primary font-medium">
            Draft restored — continue where you left off.
          </span>
          <button
            type="button"
            onClick={() => {
              discardDraft(reset, EMPTY_VALUES);
              setShowDraftBanner(false);
            }}
            className="text-xs text-body-passive underline hover:text-body shrink-0"
          >
            Discard draft
          </button>
        </div>
      )}

      <FieldSet className=" grid grid-cols-1 lg:grid-cols-2 gap-x-7">
        <div className="flex flex-col gap-lg pt-main lg:pb-main">
          <FieldGroup className="flex flex-col gap-sm">
            <FormGroupName name="OVERVIEW" />
            <div className="flex flex-col gap-7">
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
                        leftIcon={<FieldIcon Icon={Package} />}
                        isEdit={!!product}
                      />
                    </Field>
                  </div>
                )}
              />

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
                          brands?.map((m) => ({
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
                          categories?.map((m) => ({
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
                    <FieldLabel>Upload product thumbnail</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>

                  <ImageUploadBox
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                      // If there was an existing thumbnail on the product,
                      // mark it for deletion whenever the thumbnail value changes
                      // (either removed or replaced with a new file).
                      if (product?.thumbnail) {
                        setShouldDeleteThumbnail(true);
                      }
                    }}
                    width={100}
                    height={83.34}
                    className=""
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
                    <FieldLabel>Upload product images</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Existing images (URLs from backend) */}
                    {existingImages?.map((imageUrl, index) => (
                      <ImageUploadBox
                        key={`existing-${index}`}
                        value={imageUrl}
                        onChange={(file) => {
                          if (!file) {
                            // User clicked X to remove
                            handleRemoveExistingImage(imageUrl);
                          }
                        }}
                        width={376.5}
                        height={376.5}
                      />
                    ))}

                    {/* New images (Files being uploaded) */}
                    {(field.value ?? []).map((img: File, index: number) => (
                      <ImageUploadBox
                        key={`new-${index}`}
                        value={img}
                        onChange={(file) => {
                          const copy = [...(field.value ?? [])];
                          if (file) {
                            copy[index] = file;
                          } else {
                            copy.splice(index, 1);
                          }
                          field.onChange(copy);
                        }}
                        width={376.5}
                        height={376.5}
                        // className="max-w-[376.5px] w-full max-h-[376.5px] h-full"
                      />
                    ))}
                    {/* Add new image box */}
                    <ImageUploadBox
                      onChange={(file) => {
                        if (!file) return;
                        field.onChange([...(field.value || []), file]);
                      }}
                      width={376.5}
                      height={376.5}
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
