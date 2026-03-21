'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import Spinner from "@/components/general/Spinner";
import { useConfirmOrderPayment } from '@/features/marketplace/services/marketplace.api';
import { Spinner } from '@/components/ui/spinner';
import { useDispatch } from 'react-redux';
import { updateCartNumber } from '@/redux/slices/authSlice';

export default function PaymentVerificationPageComponent() {
  const params = useSearchParams();
  const router = useRouter();
  const paymentReference = params.get('paymentReference');
  const [paymentMessage, setPaymentMessage] = useState('Verifying payment');
  const dispatch = useDispatch();

  const { mutateAsync: confirmPayment } = useConfirmOrderPayment();

  useEffect(() => {
    const verify = async () => {
      if (!paymentReference) return;

      try {
        const res = await confirmPayment({
          orderNumber: paymentReference,
        });
        if (res?.data?.data?.success) {
          setPaymentMessage(res.data?.data?.message ?? 'Payment Successful');
          dispatch(updateCartNumber({ orderNumber: null })); // CLEAR REDUX DRAFT CART
        } else {
          setPaymentMessage(res.data?.data?.message ?? 'Payment Failed');
        }
        router.push(`/dashboard`);
      } catch (err) {
        console.error(err);
        setPaymentMessage('Payment Failed. An error occurred');
        router.push(`/dashboard`);
      }
    };

    verify();
  }, [paymentReference]);

  return (
    <div className="flex flex-col bg-white! items-center gap-sm justify-center min-h-200">
      <Spinner className="size-6" />
      <h4>{paymentMessage}</h4>
    </div>
  );
}
