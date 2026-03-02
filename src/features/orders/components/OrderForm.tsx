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
import { MailIcon, Package, Phone, ShieldUser } from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { CreateOrderPayload, Order, OrderItem } from "@/features/orders/types";
import { useEffect, useState } from "react";
import { Select } from "@/components/general/Select";
import FieldIcon from "@/components/general/FieldIcon";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import CopyLinkBox from "@/components/general/CopyLinkBox";
import Image from "next/image";
import { normalizePhone } from "@/lib/utils";
import Spinner from "@/components/general/Spinner";
import { UserItem } from "@/features/users/types";
import { ProductItem } from "@/features/products/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const createOrderSchema = z.object({
  wholesalerId: z.string().min(1, "Wholesaler is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity is required"),
  address: z.string().min(1, "Shipping address is required"),
  size: z.string().optional(),
  type: z.string().optional(),
});

export function OrderForm({
  handleSubmitForm,
  order,
  orderItem,
  wholesalers,
  products,
  onResetReady,
}: DialogFormProps & {
  order?: Order;
  orderItem?: OrderItem;
  wholesalers?: UserItem[];
  products?: ProductItem[];
}) {
  const [wholesalerIdDropdownOpen, setWholesalerIdDropdownOpen] =
    useState(false);
  const [productIdDropdownOpen, setProductIdDropdownOpen] = useState(false);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<
    ProductItem | undefined
  >(undefined);
  const isEditMode = !!order?.id && !!orderItem?.id;
  type OrderData = z.infer<typeof createOrderSchema>;
  const EMPTY_VALUES: OrderData = {
    wholesalerId: "",
    productId: "",
    quantity: undefined as any,
    address: "",
    size: "",
    type: "",
  };
  const form = useForm<OrderData>({
    resolver: zodResolver(createOrderSchema),
    mode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form;

  useEffect(() => {
    onResetReady?.(() => {
      reset({
        wholesalerId: order?.wholesaler?.user?.id ?? "",
        productId: orderItem?.product?.id ?? "",
        quantity: Number(orderItem?.quantity) || (undefined as any),
        address: order?.deliveryAddress?.address ?? "",
        size: orderItem?.product?.packSize?.name ?? "",
        type: orderItem?.product?.packType?.name ?? "",
      });
    });
    // Deliberately only order?.id — we want a stable function ref per product
  }, [orderItem?.id, order?.id, isEditMode]);

  const onSubmit = async (values: z.infer<typeof createOrderSchema>) => {
    if (!handleSubmitForm) return;
    const { productId, wholesalerId, address, quantity } = values;
    const sharedPayload: CreateOrderPayload = {
      wholesalerId,
      items: [
        {
          productId,
          quantity,
          unitPrice: Number(selectedProduct?.price) ?? 0,
        },
      ],
      deliveryAddress: {
        address,
      },
    };

    if (order?.id) {
      await handleSubmitForm({ payload: sharedPayload, id: order?.id });
      return;
    }
    console.log(sharedPayload);
    await handleSubmitForm(sharedPayload);
  };

  useEffect(() => {
    reset({
      wholesalerId: order?.wholesaler?.user?.id ?? "",
      productId: orderItem?.product?.id ?? "",
      quantity: Number(orderItem?.quantity) || (undefined as any),
      address: order?.deliveryAddress?.address ?? "",
      size: orderItem?.product?.packSize?.name ?? "",
      type: orderItem?.product?.packType?.name ?? "",
    });
  }, [order?.id, orderItem?.id, reset]);

  const watchedProductId = watch("productId");
  useEffect(() => {
    if (!watchedProductId) {
      setSelectedProduct(undefined);
      setValue("size", "");
      setValue("type", "");
      return;
    }
    const product = products?.find((p) => p.id === watchedProductId);
    console.log(product);
    setSelectedProduct(product);
    setValue("size", product?.packSize?.name);
    setValue("type", product?.packType?.name);
  }, [watchedProductId]);

  return (
    <form
      id="order-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1"
    >
      <FieldSet className="flex flex-1">
        <FieldGroup className="flex flex-col gap-7 pb-12">
          <Controller
            control={control}
            name="wholesalerId"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel dimLabel={wholesalerIdDropdownOpen}>
                      Order for
                    </FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    isOpen={wholesalerIdDropdownOpen}
                    setIsOpen={setWholesalerIdDropdownOpen}
                    options={
                      wholesalers?.map((w) => ({
                        value: w?.id,
                        label: `${w?.firstName} ${w.lastName}`,
                      })) || []
                    }
                    value={value}
                    onChange={onChange}
                    placeholder="Select wholesaler name"
                    searchable
                    leftIcon={<FieldIcon Icon={ShieldUser} />}
                  />
                </Field>
              </div>
            )}
          />

          <Controller
            control={control}
            name="productId"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel dimLabel={productIdDropdownOpen}>
                      Product name
                    </FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    isOpen={productIdDropdownOpen}
                    setIsOpen={setProductIdDropdownOpen}
                    options={
                      products?.map((p) => ({
                        value: p?.id,
                        label: p.name,
                      })) || []
                    }
                    value={value}
                    onChange={onChange}
                    placeholder="Select product to order"
                    searchable
                    leftIcon={<FieldIcon Icon={Package} />}
                  />
                </Field>
              </div>
            )}
          />
          <ScrollArea isSidebar orientation="horizontal" className="w-full">
            <div className="flex gap-[8px]">
              {selectedProduct ? (
                selectedProduct?.images?.map((url, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 overflow-hidden size-35 bg-storey-foreground rounded-[16px] p-[17px] border-[1.5] border-[#EDEDED]"
                  >
                    <Image
                      src={url}
                      alt={`${selectedProduct?.name ?? "Product"} image ${i + 1}`}
                      width={140}
                      height={140}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="flex gap-[8px]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 overflow-hidden size-35 bg-storey-foreground rounded-[16px] p-[17px] border-[1.5] border-[#EDEDED]"
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

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
                    placeholder="Enter quantity"
                    aria-invalid={fieldState.invalid}
                    // leftIcon={
                    //   <Image
                    //     src={"/dashboard/N.svg"}
                    //     width={16}
                    //     height={16}
                    //     alt="Naira"
                    //   />
                    // }
                    isEdit={isEditMode}
                    defaultValue={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </Field>
              </div>
            )}
          />

          <div className="flex justify-between gap-[20px]">
            <Controller
              control={control}
              name="size"
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Size</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      {...field}
                      disabled
                      type="text"
                      placeholder="Product pack size"
                      aria-invalid={fieldState.invalid}
                      // leftIcon={<FieldIcon Icon={Workflow} />}
                      isEdit={isEditMode}
                    />
                  </Field>
                </div>
              )}
            />
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-3 items-center">
                      <FieldLabel>Package type</FieldLabel>
                      {fieldState.error && (
                        <FieldError>: {fieldState.error.message}</FieldError>
                      )}
                    </div>
                    <Input
                      {...field}
                      disabled
                      type="text"
                      placeholder="Product pack type"
                      aria-invalid={fieldState.invalid}
                      // leftIcon={<FieldIcon Icon={Workflow} />}
                      isEdit={isEditMode}
                    />
                  </Field>
                </div>
              )}
            />
          </div>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value }, fieldState }) => (
              <div>
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-3 items-center">
                    <FieldLabel dimLabel={addressDropdownOpen}>
                      Delivery Address
                    </FieldLabel>
                    {fieldState.error && (
                      <FieldError>: {fieldState.error.message}</FieldError>
                    )}
                  </div>
                  <Select
                    isOpen={addressDropdownOpen}
                    setIsOpen={setAddressDropdownOpen}
                    options={[
                      {
                        label: "123 Main St, Springfield, IL 62704",
                        value: "123 Main St, Springfield, IL 62704",
                      },
                      {
                        label: "456 Maple Avenue, Apt 4B, Gotham, NY 10001",
                        value: "456 Maple Avenue, Apt 4B, Gotham, NY 10001",
                      },
                      {
                        label: "789 Oak Road, Metropolis, CA 90210",
                        value: "789 Oak Road, Metropolis, CA 90210",
                      },
                    ]}
                    value={value}
                    onChange={onChange}
                    placeholder="Select delivery address"
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

export default OrderForm;
