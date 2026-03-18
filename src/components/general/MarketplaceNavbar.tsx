"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { logout, updateCartNumber } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, ChevronDown, LogOut, User } from "lucide-react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import CartDrawer from "@/features/marketplace/components/CartDrawer";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import {
  useGetOrderDetails,
  useInitiateOrderPayment,
  useReInitiateOrderPayment,
  useUpdateDraftOrder,
} from "@/features/marketplace/services/marketplace.api";
import { CreateOrderPayload, OrderItem } from "@/features/marketplace/types";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import PaymentScreen from "@/features/marketplace/components/PaymentScreen";
import CartOrderList from "@/features/marketplace/components/CartOrderList";

const links = [
  { label: "Shop by categories", href: "/dashboard/marketplace" },
  { label: "Contact us", href: "/contact" },
];
type DrawerView = "order-list" | "payment";
export default function MarketplaceNavbar() {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;
  const orderNumber = auth.cartDraftNumber ?? "";
  const dispatch = useDispatch();
  const router = useRouter();
  const [dynamicOrderNumber, setDynamicOrderNumber] = useState<
    string | undefined
  >(orderNumber);
  const { data, refetch: refetchDraft } = useGetOrderDetails({
    orderNumber: dynamicOrderNumber ?? "",
  });
  const userDraftOrder = data?.data;
  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();
  const { mutateAsync: initiatePayment, isPending: initiatingPayment } =
    useInitiateOrderPayment();
  const { mutateAsync: reInitiatePayment, isPending: reInitiatingPayment } =
    useReInitiateOrderPayment();
  const isAuthenticated = auth.isAuthenticated;

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.qty, 0),
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerView, setDrawerView] = useState<DrawerView>("order-list");

  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(
    userDraftOrder?.checkoutUrl ?? "",
  );

  const showDrawerFooter = (() => {
    if (drawerView === "payment") return false;
    if (drawerView === "order-list") {
      // Only show footer when there are actions to take
      return true;
    }
  })();

  // Primary button label per view
  const primaryLabel = (() => {
    if (
      drawerView === "order-list" &&
      userDraftOrder &&
      userDraftOrder?.items?.length > 0
    )
      return "Proceed to payment";
    return undefined;
  })();

  // Secondary button label — "Add item" only on order-list for a draft
  const secondaryLabel = (() => {
    if (drawerView === "order-list") return "Add new item";
    return undefined;
  })();

  // Primary button should submit the form when on form view,
  // or fire handleProceedToPayment directly when on order-list view.
  // We use submitFormId for form submission and onPrimaryAction for direct calls.
  // const submitFormId =
  //   drawerView === "form" && formMode !== "view" ? "order-form" : undefined;

  const resetDrawer = () => {
    setDynamicOrderNumber(undefined);
    setDrawerView("order-list");
    // setPaymentObject(undefined);
  };

  const handleRemoveItem = async (item: OrderItem) => {
    if (!item) return;
    const { product, quantity } = item;
    const payload: CreateOrderPayload = {
      item: {
        productId: product?.id,
        itemId: item?.id,
        quantity,
        action: "REMOVE",
      },
    };

    await updateDraftOrder({
      payload,
      id: orderNumber,
    });
    refetchDraft();
  };

  // ── Proceed to payment (primary on order-list) ────────────────────────────

  const handleProceedToPayment = async () => {
    if (!orderNumber) return;

    // Check if a previous checkout URL exists and is still valid
    const now = new Date();
    const expiresAt = userDraftOrder?.paymentExpiresAt
      ? new Date(userDraftOrder?.paymentExpiresAt)
      : null;
    const isExpired = !expiresAt || expiresAt <= now;
    const hasValidCheckout = !!userDraftOrder?.checkoutUrl && !isExpired;

    if (hasValidCheckout) {
      // Still valid — skip re-initiation, show existing virtual accounts
      setCheckoutUrl(userDraftOrder?.checkoutUrl);
      setDrawerView("payment");
      return;
    }

    // Expired or never initiated — call initiate-payment endpoint
    const res =
      userDraftOrder?.status === "DRAFT"
        ? await initiatePayment({
            orderNumber,
          })
        : await reInitiatePayment({
            orderNumber,
          });

    if (res.data.status === "success") {
      refetchDraft();
      // Sync updated order data (new paymentExpiresAt, checkoutUrl)
      setDynamicOrderNumber(
        res.data.data?.order?.orderNumber ?? userDraftOrder?.orderNumber,
      );
      dispatch(
        updateCartNumber({
          orderNumber:
            res.data.data?.order?.orderNumber ?? userDraftOrder?.orderNumber,
        }),
      );
      setCheckoutUrl(res.data.data?.checkoutUrl ?? userDraftOrder?.checkoutUrl);
      setDrawerView("payment");
    }
  };

  // ── Add item (secondary on order-list, draft only) ────────────────────────

  const handleAddItem = () => {
    //close drawer and show marketplace
    setDrawerView("order-list");
  };
  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    router.push("/login");
  };

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-18">
          <div className="flex items-center gap-lg">
            {/* Logo */}

            <Link href="/dashboard" className="shrink-0">
              <Image
                src="/auth/jooav-logo.svg"
                alt="JOOAV"
                width={90}
                height={24}
                priority
              />
            </Link>

            {/* nav */}
            <nav className="hidden smd:flex items-center gap-2 text-sm font-medium text-foreground">
              {links.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="hover:text-primary transition-colors p-sm"
                >
                  <span className="py-4 px-2 leading-[1.5] tracking-[0.04em] font-medium text-body">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-lg">
            {/* Cart icon — opens CartDrawer */}
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer relative w-8.5 h-8.5 p-4 flex justify-center items-center rounded-full hover:bg-storey-foreground transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-outline" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated && user ? (
              /* Authenticated avatar + dropdown */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center rounded-full hover:bg-gray-100 px-2 py-1 transition-colors"
                >
                  <Avatar className="size-8">
                    {user.avatar && (
                      <AvatarImage
                        src={user.avatar}
                        alt={user.firstName ?? ""}
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate p-sm">
                    {user.firstName}
                  </span>
                  {/* <ChevronDown className="h-4 w-4 text-muted-foreground" /> */}
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div
                      className={cn(
                        "absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg z-50 py-1",
                        "animate-in fade-in-0 slide-in-from-top-1 duration-150",
                      )}
                    >
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg mx-1"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Unauthenticated CTA buttons */
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <DashboardDrawer
        // showTrigger
        // triggerText="Create Order"
        openDrawer={(isOpen) => {
          if (isOpen) resetDrawer();
          setOpen(isOpen);
        }}
        isOpen={open}
        // Binds primary button to form submit when on form view
        // submitFormId={submitFormId}
        // Fires directly when on order-list (no form to submit)
        onPrimaryAction={
          drawerView === "order-list" ? handleProceedToPayment : undefined
        }
        // Secondary fires "Add item" on order-list for drafts
        // onSecondaryAction={
        //   drawerView === "order-list" && isDraft(selectedOrder)
        //     ? handleAddItem
        //     : undefined
        // }
        submitLoading={
          // creating ||
          updating ||
          // deleting ||
          initiatingPayment ||
          reInitiatingPayment
        }
        secondarySubmitLoading={false}
        submitLabel={primaryLabel}
        // secondarySubmitLabel={secondaryLabel}
        showSecondaryButton={!!secondaryLabel}
        // showFooter={showDrawerFooter}
        temporaryFooter={
          <div className="flex flex-col gap-main">
            <Button
              className="w-full gap-4 tracking-[0.02em]"
              onClick={() => router.push("/dashboard/marketplace/checkout")}
            >
              Checkout
            </Button>
            <Button
              variant="neutral"
              className="w-full gap-4 text-primary tracking-[0.02em]"
              onClick={() => router.push("/dashboard/marketplace")}
            >
              Continue shopping
            </Button>
          </div>
        }
        showHeader={false}
        // showHeader={drawerView !== "payment"}
      >
        {/* ── Payment screen ─────────────────────────────────────── */}
        {drawerView === "payment" && (
          <DrawerBoxContent
            fillHeight
            // showClose
            content={
              <PaymentScreen
                checkoutUrl={checkoutUrl ?? ""}
                setOpen={setOpen}
                refetch={refetchDraft}
                setFormView={setDrawerView}
              />
            }
          />
        )}

        {/* ── Order list ─────────────────────────────────────────── */}
        {drawerView === "order-list" && orderNumber && (
          <DrawerBoxContent
            heading="Order details"
            showClose
            content={
              <CartOrderList
                order={userDraftOrder}
                orderNumber={dynamicOrderNumber}
                // isPending={isPending}
                onRemoveItem={handleRemoveItem}
              />
            }

            // statusTag={
            //   <TableTag
            //     small
            //     className={getOrderStatusStyles(selectedOrder.status).styles}
            //     text={getOrderStatusStyles(selectedOrder.status).text}
            //   />
            // }
          />
        )}
      </DashboardDrawer>

      {/* Global cart drawer */}
      {/* <CartDrawer open={cartOpen} onOpenChange={setOpen} /> */}
    </>
  );
}
