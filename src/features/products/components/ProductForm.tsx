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
  ClockFading,
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
import { useEffect, useRef, useState } from "react";
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

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  brandId: z.string().min(1, "Brand is required"),
  variantId: z.string().min(1, "variant is required"),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  packTypeId: z.string().min(1, "Pack type is required"),
  packSizeId: z.string().min(1, "Pack size is required"),
  price: z.number().min(0, "Price is required"),
  quantity: z.number().min(0, "Quantity is required"),
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
  onResetReady,
}: DialogFormProps & {
  product?: ProductItem;
  brands?: BrandItem[];
  categories?: ParentCategoryItem[];
}) {
  const isEditMode = !!product?.id;
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [variantDropdownOpen, setVariantDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
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
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    quantity: undefined as any,
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
  const { clearDraft, discardDraft, readDraft } = useProductDraft(
    form,
    isEditMode,
  );

  // ─ Expose a resetForm function to the parent (for FormDropdown) ──────────
  useEffect(() => {
    onResetReady?.(() => {
      if (isEditMode) {
        // Edit: reset to current product values, no draft involved
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
          price: Number(product?.price) || (undefined as any),
          quantity: Number(product?.quantity) || (undefined as any),
          thumbnail: product?.thumbnail || undefined,
          images: [],
        });
        setExistingImages(product?.images ?? []);
        setImagesToDelete([]);
        setShouldDeleteThumbnail(false);
      } else {
        // Create: clear draft and blank the form
        discardDraft(reset, EMPTY_VALUES);
        setShowDraftBanner(false);
      }
    });
    // Deliberately only product?.id — we want a stable function ref per product
  }, [product?.id, isEditMode]);

  // ── Single async reset effect ─────────────────────────────────────────────
  // Only one reset() call happens here, so draft can never be wiped by a second reset.
  useEffect(() => {
    const run = async () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);

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
          price: Number(product?.price) || (undefined as any),
          quantity: Number(product?.quantity) || (undefined as any),
          thumbnail: product?.thumbnail || undefined,
          images: [],
        });
        setExistingImages(product?.images ?? []);
        setImagesToDelete([]);
        setShouldDeleteThumbnail(false);
        setShowDraftBanner(false);
      } else {
        // readDraft is async — it reconstructs File objects from stored base64
        const draft = await readDraft();
        if (draft) {
          reset({ ...EMPTY_VALUES, ...draft });
          // Banner shows for 2 seconds then auto-hides
          setShowDraftBanner(true);
          bannerTimer.current = setTimeout(
            () => setShowDraftBanner(false),
            3000,
          );
        } else {
          reset(EMPTY_VALUES);
          setShowDraftBanner(false);
        }
        setExistingImages([]);
        setImagesToDelete([]);
        setShouldDeleteThumbnail(false);
      }
    };

    run();
    return () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
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
    formData.append("quantity", values.quantity.toString());

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
      setShowDraftBanner(false);
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

      <FieldSet className=" grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-7">
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
                        <FieldLabel dimLabel={brandDropdownOpen}>
                          Select brand
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        isOpen={brandDropdownOpen}
                        setIsOpen={setBrandDropdownOpen}
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
                        <FieldLabel dimLabel={variantDropdownOpen}>
                          Select variant
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        isOpen={variantDropdownOpen}
                        setIsOpen={setVariantDropdownOpen}
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
                        <FieldLabel dimLabel={sizeDropdownOpen}>
                          Select pack size
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        isOpen={sizeDropdownOpen}
                        setIsOpen={setSizeDropdownOpen}
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
                        <FieldLabel dimLabel={typeDropdownOpen}>
                          Select pack type
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        isOpen={typeDropdownOpen}
                        setIsOpen={setTypeDropdownOpen}
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
                        <FieldLabel dimLabel={categoryDropdownOpen}>
                          Select category
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        isOpen={categoryDropdownOpen}
                        setIsOpen={setCategoryDropdownOpen}
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
                        <FieldLabel dimLabel={subcategoryDropdownOpen}>
                          Select subcategory
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError>: {fieldState.error.message}</FieldError>
                        )}
                      </div>
                      <Select
                        isOpen={subcategoryDropdownOpen}
                        setIsOpen={setSubcategoryDropdownOpen}
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
              name="quantity"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Quantity</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      // {...field}
                      type="number"
                      placeholder="20"
                      aria-invalid={fieldState.invalid}
                      leftIcon={<FieldIcon Icon={ClockFading} />}
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
                  <div className="flex gap-3 items-center py-sm">
                    <h4>Upload product thumbnail</h4>
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
                    height={100}
                    className="p-md"
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="images"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center py-sm">
                    <h4>Upload product images</h4>
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
                        // imageClassName="p-16!"
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
                        imageClassName="p-16!"
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
