import Spinner from "@/components/general/Spinner";
import { Button } from "@/components/ui/button";
import { useConfirmOrderPayment } from "@/features/orders/services/orders.api";
import { OrderVirtualAccount } from "@/features/orders/types";
import { Send } from "lucide-react";
import React from "react";

const PaymentScreen = ({
  virtualAccount,
  orderNumber,
  loading,
  onConfirmPayment,
}: {
  virtualAccount?: OrderVirtualAccount;
  orderNumber: string;
  loading?: boolean;
  onConfirmPayment?: () => void;
}) => {
  console.log(virtualAccount);
  return (
    <div className="flex justify-center items-center p-md min-h-[calc(90vh-24px)]">
      <div className="py-sm gap-main flex flex-col">
        <div className={`flex flex-col gap-5 ${`py-sm`}`}>
          <h4 className="leading-[1.2] tracking-[0.01em]">
            Complete Order Payment
          </h4>
          <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
            {"Make transfer to the account provided below"}
          </p>

          <div className="flex flex-col gap-4">
            <h2>{virtualAccount?.accountNumber}</h2>
            <p>{virtualAccount?.bankName}</p>
            <p>{virtualAccount?.accountName}</p>
          </div>
        </div>
        <Button
          type={"button"}
          size={"neutral"}
          variant="input"
          onClick={onConfirmPayment}
          className="shadow-input! font-semibold w-fit"
          disabled={loading}
        >
          <span className="px-2"><Send  className="text-outline"/></span>
          <span className="px-2 py-4 text-[#FF803F] text-[15px]">
            I have made payment
          </span>
          {loading && <Spinner className="size-4" color="#FF803F" />}
        </Button>
      </div>
    </div>
  );
};

export default PaymentScreen;
