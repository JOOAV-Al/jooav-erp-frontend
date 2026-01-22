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
import { DiamondPlus, GitBranchPlus, Workflow } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { VariantItem } from "@/features/variants/types";
import { useEffect, useState } from "react";
import { Select } from "@/components/general/Select";
import { useGetBrands } from "@/features/brands/services/brands.api";

const createVariantSchema = z.object({
  // variants: z.array(z.string("Enter a valid name")),
  name: z.string("Enter a valid name"),
  brandId: z.string("Enter a valid name"),
});

export function VariantForm({
  handleSubmitForm,
  variant,
}: DialogFormProps & { variant?: VariantItem }) {
  const { data: brands } = useGetBrands({});
  const [] = useState<VariantItem[]>([]);
  type VariantData = z.infer<typeof createVariantSchema>;
  const form = useForm<VariantData>({
    resolver: zodResolver(createVariantSchema),
    mode: "onChange",
    defaultValues: {
      name: variant?.name ?? "",
      brandId: variant?.brandId ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
    reset,
  } = form;

  const onSubmit = async (values: z.infer<typeof createVariantSchema>) => {
    if (!handleSubmitForm) return;
    console.log({ variant });
    console.log({ values });
    if (variant?.id) {
      //Build partial payload using dirty fields
      const changes: Partial<VariantData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof VariantData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: variant?.id });
      return;
    }
    await handleSubmitForm(values);
  };

  useEffect(() => {
    reset({
      name: variant?.name ?? "",
    });
  }, [variant?.id, reset]);
  return (
    <form
      id="variant-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7">
          <Controller
            control={control}
            name="brandId"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Brand</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    options={
                      brands?.data?.map((m, i) => ({
                        label: m.name,
                        value: m.id,
                      })) || []
                    }
                    value={value}
                    onChange={onChange}
                    placeholder="Select manufacturer"
                    searchable
                    leftIcon={
                      <GitBranchPlus
                        className="h-5 w-5 text-outline-passive"
                        strokeWidth={2.5}
                      />
                    }
                  />
                </Field>
              </div>
            )}
          />
          {/* NAME */}
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
                    leftIcon={
                      <Workflow
                        strokeWidth={2.5}
                        className="h-5 w-5 text-outline-passive"
                      />
                    }
                    isEdit={!!variant}
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

export default VariantForm;

// "use client";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
//   FieldSet,
// } from "@/components/ui/field";
// import { DiamondPlus, GitBranchPlus } from "lucide-react";
// import { DialogFormProps } from "@/interfaces/general";
// import { useEffect } from "react";
// import { Select } from "@/components/general/Select";
// import { useGetBrands } from "@/features/brands/services/brands.api";
// import { TagInput } from "@/components/ui/TagInput";

// // Updated schema to match the actual data structure
// const createVariantSchema = z.object({
//   variants: z.array(z.string()).min(1, "At least one variant is required"),
//   brandId: z.string().min(1, "Brand is required"),
// });

// // Updated interface to reflect that we're working with a brand that has variants
// interface BrandWithVariants {
//   id: string;
//   name: string;
//   brandId: string;
//   variants?: string[]; // Array of variant names
// }

// export function VariantForm({
//   handleSubmitForm,
//   variant,
// }: DialogFormProps & { variant?: BrandWithVariants }) {
//   const { data: brands } = useGetBrands({});

//   type VariantData = z.infer<typeof createVariantSchema>;

//   const form = useForm<VariantData>({
//     resolver: zodResolver(createVariantSchema),
//     mode: "onChange",
//     defaultValues: {
//       variants: variant?.variants ?? [],
//       brandId: variant?.brandId ?? "",
//     },
//   });

//   const {
//     handleSubmit,
//     control,
//     formState: { dirtyFields },
//     reset,
//   } = form;

//   const onSubmit = async (values: z.infer<typeof createVariantSchema>) => {
//     if (!handleSubmitForm) return;

//     if (variant?.id) {
//       // Build partial payload using dirty fields
//       const changes: Partial<VariantData> = {};
//       for (const key of Object.keys(dirtyFields) as Array<keyof VariantData>) {
//         const val = values[key];
//         if (val !== undefined ) {
//           if(key === "variants") {
//             // when key is "variants" we know val must be string[]
//             changes[key] = val as unknown as string[];
//           } else {
//             // brandId is a string
//             changes[key] = val as unknown as string;
//           }
//         }
//       }
//       const payload = Object.keys(changes).length ? changes : values;
//       await handleSubmitForm({ payload, id: variant?.id });
//       return;
//     }
//     await handleSubmitForm(values);
//   };

//   useEffect(() => {
//     reset({
//       variants: variant?.variants ?? [],
//       brandId: variant?.brandId ?? "",
//     });
//   }, [variant?.id, reset, variant?.variants, variant?.brandId]);

//   return (
//     <form
//       id="variant-form"
//       onSubmit={handleSubmit(onSubmit)}
//       className="flex flex-col flex-1"
//     >
//       <FieldSet className="flex flex-1">
//         <FieldGroup className="flex flex-col pb-12">
//           {/* BRAND SELECT */}
//           <Controller
//             control={control}
//             name="brandId"
//             render={({ field: { onChange, value }, fieldState }) => (
//               <div>
//                 <Field data-invalid={fieldState.invalid}>
//                   <div className="flex gap-3 items-center">
//                     <FieldLabel>Brand name</FieldLabel>
//                     {fieldState.error && (
//                       <FieldError>: {fieldState.error.message}</FieldError>
//                     )}
//                   </div>
//                   <Select
//                     options={
//                       brands?.data?.map((m) => ({
//                         label: m.name,
//                         value: m.id,
//                       })) || []
//                     }
//                     value={value}
//                     onChange={onChange}
//                     placeholder="Select brand"
//                     searchable
//                     leftIcon={
//                       <GitBranchPlus
//                         className="h-5 w-5 text-outline-passive"
//                         strokeWidth={2.5}
//                       />
//                     }
//                   />
//                 </Field>
//               </div>
//             )}
//           />

//           {/* VARIANT NAMES - TAG INPUT */}
//           <Controller
//             control={control}
//             name="variants"
//             render={({ field: { onChange, value }, fieldState }) => (
//               <div>
//                 <Field data-invalid={fieldState.invalid}>
//                   <div className="flex gap-3 items-center">
//                     <FieldLabel>Variant name</FieldLabel>
//                     {fieldState.error && (
//                       <FieldError>: {fieldState.error.message}</FieldError>
//                     )}
//                   </div>
//                   <TagInput
//                     value={value || []}
//                     onChange={onChange}
//                     placeholder={
//                       variant?.id ? "Add variant" : "Enter variant name"
//                     }
//                     leftIcon={
//                       <DiamondPlus
//                         strokeWidth={2.5}
//                         className="h-5 w-5 text-outline-passive"
//                       />
//                     }
//                   />
//                 </Field>
//               </div>
//             )}
//           />
//         </FieldGroup>
//       </FieldSet>
//     </form>
//   );
// }

// export default VariantForm;
