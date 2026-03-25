'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useConfirmOrderPayment } from '@/features/marketplace/services/marketplace.api';
import { PageSpinner } from '@/components/ui/spinner';
import { useDispatch } from 'react-redux';
import { updateCartNumber } from '@/redux/slices/authSlice';

export default function PaymentVerificationPageComponent() {
  const params = useSearchParams();
  const router = useRouter();
  const paymentReference = params.get('paymentReference');
  const [paymentMessage, setPaymentMessage] = useState('Verifying payment');
  const dispatch = useDispatch();

  const { mutateAsync: confirmPayment, isPending } = useConfirmOrderPayment();

  useEffect(() => {
    const verify = async () => {
      if (!paymentReference) return;
      if (isPending) return
        try {
          const res = await confirmPayment({
            orderNumber: paymentReference,
          });
          if (res?.data?.data?.success) {
            setPaymentMessage(res.data?.data?.message ?? "Payment Successful");
            dispatch(updateCartNumber({ orderNumber: null })); // CLEAR REDUX DRAFT CART
            router.push(`/dashboard/orders`);
          } else {
            setPaymentMessage(res.data?.data?.message ?? "Payment Failed");
            router.push(`/dashboard/orders?tab=incomplete`);
          }
        } catch (err) {
          console.error(err);
          setPaymentMessage("Payment Failed. An error occurred");
          router.push(`/dashboard/orders?tab=incomplete`);
        }
    };

    verify();
  }, [paymentReference]);

  return (
    <div className="flex flex-col bg-white! items-center gap-sm justify-center py-25">
      <PageSpinner />
      <h4>{paymentMessage}</h4>
      {paymentMessage && <p className='font-medium leading-[1.5] tracking-[0.02em] text-body'>Redirecting to orders...</p>}
    </div>
  );
}
