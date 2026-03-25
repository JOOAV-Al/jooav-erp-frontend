"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, LogOut, User } from "lucide-react";
import Cookies from "js-cookie";
import { cn, truncateText } from "@/lib/utils";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import {
  useGetOrderDetails,
  useUpdateDraftOrder,
} from "@/features/marketplace/services/marketplace.api";
import { CreateOrderPayload, OrderItem } from "@/features/marketplace/types";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import CartOrderList from "@/features/marketplace/components/CartOrderList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginForm from "@/features/auth/components/LoginForm";
import CategoriesDropdown from "@/features/marketplace/components/CategoriesDropdown";

const links = [
  // { label: "Shop by categories", href: "/marketplace" },
  { label: "Contact us", href: "/contact" },
];

export default function MarketplaceNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const orderNumber = auth.cartDraftNumber ?? "";
  const {
    data,
    refetch: refetchDraft,
    isPending: draftCartPending,
  } = useGetOrderDetails({
    orderNumber: orderNumber ?? "",
  });
  const userDraftOrder = data?.data;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openLoginForm, setOpenLoginForm] = useState(false);
  const { mutateAsync: updateDraftOrder, isPending: updating } =
    useUpdateDraftOrder();

  // Functions
  const cartCount = userDraftOrder?.items?.length || 0;
  // const cartCount = useSelector((state: RootState) =>
  //   state.cart.items.reduce((sum, i) => sum + i.qty, 0),
  // );

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

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    router.push("/login");
  };

  const options = [
    {
      label: "Inventory",
      action: () => router.push("/dashboard/inventory"),
    },
    {
      label: "Orders",
      action: () => router.push("/dashboard/orders"),
    },
    {
      action: handleLogout,
      label: "Logout",
    },
  ];

  const hideCheckout =
    updating ||
    draftCartPending ||
    (userDraftOrder?.items && userDraftOrder?.items?.length <= 0);
  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-white ">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-lg">
            {/* Logo */}
            <Link href="/marketplace" className="shrink-0">
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
              <CategoriesDropdown />
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
              onClick={() => {
                if (isAuthenticated) {
                  setOpen(true);
                } else {
                  setOpenLoginForm(true);
                }
              }}
              className="cursor-pointer relative w-8.5 h-8.5 p-4 flex justify-center items-center rounded-full hover:bg-storey-foreground transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-6 w-6 text-outline" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 h-5.5 w-5.5 rounded-full bg-destructive text-[13px] tracking-[0.05em] text-[#FEFAEB] flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated && user ? (
              /* Authenticated avatar + dropdown */
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer flex items-center rounded-full hover:bg-gray-100 px-2 py-1 transition-colors">
                    <Avatar className="size-6">
                      {user.avatar && (
                        <AvatarImage
                          src={user.avatar}
                          alt={user.firstName ?? ""}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {(user.firstName?.[0] ?? "") +
                          (user.lastName?.[0] ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium max-w-[100px] p-sm">
                      {truncateText(user.firstName, 10)}
                    </span>
                    {/* <ChevronDown className="h-4 w-4 text-muted-foreground" /> */}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="flex flex-col gap-5 p-sm! rounded-lg! max-h-90 w-[208px] overflow-y-auto user-dropdown"
                >
                  <p className="py-5 px-3 tracking-[0.08em] text-body-passive font-mono leading-[1.2] text-xs font-normal">
                    OTHERS
                  </p>
                  {options?.map((o, i) => (
                    <DropdownMenuItem
                      key={i}
                      className={cn(
                        "rounded-md py-5 px-sm h-[22px] cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
                      )}
                      onClick={() => o.action?.()}
                    >
                      <div className="flex items-center gap-5">
                        <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                          {o.label}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Unauthenticated CTA buttons */
              <div className="flex items-center gap-6">
                <DropdownMenu
                  open={openLoginForm}
                  onOpenChange={setOpenLoginForm}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="neutral">
                      Login
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="flex flex-col gap-5 shadow-none bg-transparent border-none!"
                  >
                    <LoginForm
                      isCustom={true}
                      handleCustomAction={() => setOpenLoginForm(false)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size={"neutral"}
                  onClick={() => router.push("/register")}
                >
                  Create account
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <DashboardDrawer
        openDrawer={setOpen}
        isOpen={open}
        temporaryFooter={
          <div className="flex flex-col gap-main w-full">
            {!hideCheckout && (
              <Button
                className="w-full gap-4 tracking-[0.02em]"
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/checkout");
                }}
              >
                Checkout
              </Button>
            )}
            <Button
              variant="neutral"
              className="w-full gap-4 text-body tracking-[0.02em]"
              onClick={() => {
                setOpen(false);
                router.push("/marketplace");
              }}
            >
              Continue shopping
            </Button>
          </div>
        }
        showHeader={false}
      >
        {/* ── Order list ─────────────────────────────────────────── */}
        {orderNumber && (
          <DrawerBoxContent
            heading={`Cart (${userDraftOrder?.items?.length ?? 0})`}
            showClose
            content={
              <CartOrderList
                order={userDraftOrder}
                orderNumber={orderNumber}
                isPending={draftCartPending}
                onRemoveItem={handleRemoveItem}
              />
            }
          />
        )}
      </DashboardDrawer>
    </>
  );
}
