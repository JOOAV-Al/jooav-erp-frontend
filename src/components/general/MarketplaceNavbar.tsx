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
import { ShoppingCart, ChevronDown, LogOut, User } from "lucide-react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import CartDrawer from "@/features/marketplace/components/CartDrawer";

export default function MarketplaceNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;
  const isAuthenticated = auth.isAuthenticated;

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.qty, 0)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    router.push("/login");
  };

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
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

          {/* Centre nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground">
            <Link href="/dashboard/marketplace" className="hover:text-primary transition-colors">
              Shop by categories
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact us
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart icon — opens CartDrawer */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" strokeWidth={2} />
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
                  className="flex items-center gap-2 rounded-full hover:bg-gray-100 px-2 py-1 transition-colors"
                >
                  <Avatar className="size-8">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.firstName ?? ""} />}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {user.firstName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div
                      className={cn(
                        "absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg z-50 py-1",
                        "animate-in fade-in-0 slide-in-from-top-1 duration-150"
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

      {/* Global cart drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
