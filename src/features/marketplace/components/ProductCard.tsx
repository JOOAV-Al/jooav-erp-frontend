'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import {
  useGetOrderDetails,
  useUpdateDraftOrder,
} from '@/features/marketplace/services/marketplace.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  CreateOrderPayload,
  Order,
  Product,
} from '@/features/marketplace/types';
import { Spinner } from '@/components/ui/spinner';
// import Spinner from "@/components/general/Spinner";

export interface ProductCardData {
  id: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  currency?: string;
  size?: string;
  type?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  href?: string;
  userDraftCart?: Order;
  refetch?: () => void;
}

function formatPrice(amount: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({
  product,
  className,
  userDraftCart,
  refetch,
}: ProductCardProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const draftCart = auth.cartDraftNumber;
  // const dispatch = useDispatch();
  const router = useRouter();
  // const { data, refetch } = useGetOrderDetails({
  //   orderNumber: draftCart ?? "",
  // });
  // const userDraftCart = data?.data;
  const existingItem = userDraftCart?.items?.find(
    i => i?.product?.id === product?.id,
  );

  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();

  const handleAddToCart = async () => {
    const itemToSave = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product?.price,
      quantity: 10,
      size: product?.size,
      type: product?.type,
      currency: 'NGN',
    };

    //If authenticated, save cart as draft and update
    if (isAuthenticated) {
      const existingItem = userDraftCart?.items?.find(
        i => i?.product?.id === product?.id,
      );
      if (existingItem) {
        toast('Product already in cart');
        return;
      }

      const payload: CreateOrderPayload = {
        item: {
          action: 'ADD',
          productId: product?.id,
          quantity: 10,
        },
      };

      const res = await updateDraftOrder({
        payload,
        id: draftCart ?? '',
      });
      if (res.data.status === 'success') {
        refetch?.();
      }
    } else {
      // Else, save to local storage then retrieve and save as draft after login
      localStorage.setItem('tempCartItem', JSON.stringify(itemToSave));
      router.push('/login?fromCart=true');
    }
  };

  return (
    <Link
      href={`/dashboard/marketplace/product/${product.id}`}
      className={cn(
        'group relative flex flex-col gap-5',
        'hover:border hover:border-border-main hover:rounded-t-2xl transition-all duration-200',
        'overflow-hidden cursor-pointer',
        className,
      )}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-storey-foreground">
        <div className="flex items-center justify-center h-full">
          <div className="max-w-66 w-full h-47 flex justify-center">
            <Image
              src={product.image}
              alt={product.name}
              // fill
              width={160}
              height={160}
              // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Cart icon — appears on hover */}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          aria-label="Add to cart"
          className={cn(
            'absolute bottom-2 right-2 z-10',
            'h-8 w-8 rounded-full bg-white shadow-card',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100',
            'translate-y-2 group-hover:translate-y-0',
            'transition-all duration-200',
            'hover:bg-primary hover:text-white cursor-pointer',
            `${existingItem ? 'bg-primary text-white' : ''}`,
          )}
        >
          {updating ? (
            <Spinner />
          ) : (
            <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="px-main pt-5 pb-main flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium leading-[1.5] tracking-[0.03em] text-body line-clamp-1">
            {product.name}
          </p>
          {product.variant && (
            <p className="text-sm leading-[1.5] tracking-[0.04em] text-body-passive font-medium">
              {product.variant}
            </p>
          )}
        </div>
        <h3>{formatPrice(product.price, product.currency)}</h3>
      </div>
    </Link>
  );
}
