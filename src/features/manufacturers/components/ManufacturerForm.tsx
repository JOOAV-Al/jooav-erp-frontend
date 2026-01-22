"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DiamondPlus, PenLine } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { ManufacturerItem } from "@/features/manufacturers/types";
import { useEffect } from "react";

const createManufacturerSchema = z.object({
  name: z.string("Enter a valid name"),
});

export function ManufacturerForm({
  // closeDialog,
  // loading,
  handleSubmitForm,
  manufacturer,
}: DialogFormProps & { manufacturer?: ManufacturerItem }) {
  // const { mutateAsync: createManufacturer, isPending } =
  //   useCreateManufacturer();

  type ManufacturerData = z.infer<typeof createManufacturerSchema>;
  const form = useForm<ManufacturerData>({
    resolver: zodResolver(createManufacturerSchema),
    mode: "onChange",
    defaultValues: {
      name: manufacturer?.name ?? "",
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
      name: manufacturer?.name ?? "",
    });
  }, [manufacturer?.id, reset]);

  const onSubmit = async (values: z.infer<typeof createManufacturerSchema>) => {
    if (!handleSubmitForm) return;
    console.log({ manufacturer });
    console.log({ values });
    if (manufacturer?.id) {
      //Build partial payload using dirty fields
      const changes: Partial<ManufacturerData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof ManufacturerData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      const payload = Object.keys(changes).length ? changes : values;
      await handleSubmitForm({ payload, id: manufacturer?.id });
      return;
    }
    await handleSubmitForm(values);

    // // fallback local behavior
    // const response = await createManufacturer(values);
    // setMessage(response?.data?.message);
    // if (closeDialog) closeDialog();
    console.log(values);
  };

  return (
    <form
      id="manufacturer-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7">
          {/* NAME */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel>Manufacturer name</FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter manufacturer name"
                    aria-invalid={fieldState.invalid}
                    leftIcon={
                      <DiamondPlus
                        strokeWidth={2.5}
                        className="h-5 w-5 text-outline-passive"
                      />
                    }
                    isEdit={!!manufacturer}
                  />
                </Field>
              </div>
            )}
          />
        </FieldGroup>
        {/* internal submit (kept for smaller screens or when footer not used) */}
        {/* <div className="mt-auto">
          <Button type="submit" className="w-full mt-7" disabled={loading}>
            {loading ? "Loading..." : "Create"}
          </Button>
        </div> */}
      </FieldSet>
    </form>
  );
}

export default ManufacturerForm;
