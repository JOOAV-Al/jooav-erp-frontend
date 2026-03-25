// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const searchparams = useSearchParams()
//   const fromCart = searchparams.get("fromCart")
//   const pathname = usePathname();
//   const isLogin = pathname === "/login" || pathname === "/";
//   const isRegister = pathname === "/register";

//   return (
//     <div className="min-h-screen flex bg-background overflow-y-auto">
//       {/* ─────────────────────────────── LEFT PANEL ─────────────────────────────── */}
//       <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:max-w-[50%]">
//         {/* Constrained 372px column — card + terms sit inside this */}
//         <div className="w-full max-w-[420px] flex flex-col items-center">
//           {/* Auth card — children render here */}
//           {children}

//           {/* Terms — below the card, same 372px width */}
//           <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed w-full px-1">
//             {isRegister ? (
//               <>
//                 By signing up, you agree to our{" "}
//                 <Link
//                   href="/terms"
//                   className="text-heading underline font-medium"
//                 >
//                   Terms
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href="/terms"
//                   className="text-heading underline font-medium"
//                 >
//                   Condition of use
//                 </Link>{" "}
//                 and Privacy policy. See{" "}
//                 <Link
//                   href="/terms"
//                   className="text-primary underline font-medium"
//                 >
//                   here
//                 </Link>
//                 .
//               </>
//             ) : (
//               <>
//                 By using{" "}
//                 <span className="font-semibold text-foreground">jooav.com</span>
//                 , you agree to our{" "}
//                 <Link
//                   href="/terms"
//                   className="text-heading underline font-medium"
//                 >
//                   Terms
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href="/terms"
//                   className="text-heading underline font-medium"
//                 >
//                   Condition of use
//                 </Link>{" "}
//                 and Privacy policy.
//               </>
//             )}
//           </p>
//         </div>
//       </div>

//       {/* ─────────────────────────────── RIGHT PANEL ────────────────────────────── */}
//       <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden bg-gradient-to-b from-blue-100 to-transparent">
//         {/* Illustration — top, spanning full width, clipped */}
//         <div className="w-full overflow-hidden flex-shrink-0">
//           <Image
//             src="/auth/auth-illustration.svg"
//             alt=""
//             width={752}
//             height={150}
//             className="w-full h-auto object-cover object-top"
//             priority
//             aria-hidden
//           />
//         </div>

//         {/* Spacer to push content down */}
//         <div className="flex-1" />

//         {/* Brand content — now at the bottom */}
//         <div className="flex flex-col items-center gap-3 text-center px-10 pb-4">
//           <Image
//             src="/auth/jooav-logo.svg"
//             alt="Jooav"
//             width={110}
//             height={30}
//             className="pb-4"
//           />
//           <p className="text-foreground text-sm font-medium leading-relaxed max-w-[372px]">
//             One-stop FMCG marketplace, for the wholesalers who want efficiency
//             and reliability.
//           </p>
//         </div>

//         {/* Bottom pill bar */}
//         <div className="p-8">
//           <div className="flex items-center justify-between rounded-xl bg-nominal-background p-main h-pill text-sm shadow-card border-b-2 border-blue-100 max-w-[500px] mx-auto">
//             {/* Left side — toggles per page */}
//             {isLogin && (
//               <p className="text-foreground">
//                 No account yet?{" "}
//                 <Link
//                   href={
//                     fromCart === "true"
//                       ? "/register?fromCart=true"
//                       : "/register"
//                   }
//                   className="text-heading font-semibold hover:underline"
//                 >
//                   Create account
//                 </Link>
//               </p>
//             )}
//             {isRegister && (
//               <p className="text-foreground">
//                 Have an account?{" "}
//                 <Link
//                   href={fromCart === "true" ? "/login?fromCart=true" : "/login"}
//                   className="text-heading font-body font-bold text-button leading-none tracking-button text-cap-trim hover:underline"
//                 >
//                   Login
//                 </Link>
//               </p>
//             )}
//             {!isLogin && !isRegister && (
//               <p className="text-foreground">
//                 <Link
//                   href={
//                     fromCart === "true" ? "/login?fromCart=true" : "/login"
//                   }
//                   className="text-primary hover:underline"
//                 >
//                   Back to login
//                 </Link>
//               </p>
//             )}

//             {/* Right side — nav links */}
//             <nav className="flex gap-5 text-muted-foreground">
//               <Link
//                 href="/"
//                 className="hover:text-foreground transition-colors"
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/contact"
//                 className="hover:text-foreground transition-colors"
//               >
//                 Contact us
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import LoadingScreen from "@/layouts/LoadingScreen";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const searchparams = useSearchParams();
  const fromCart = searchparams.get("fromCart");
  const pathname = usePathname();
  const isLogin = pathname === "/login" || pathname === "/";
  const isRegister = pathname === "/register";

  return (
    <div className="min-h-screen flex bg-background overflow-y-auto">
      {/* ─────────────────────────────── LEFT PANEL ─────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:max-w-[50%]">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          {children}
          <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed w-full px-1">
            {isRegister ? (
              <>
                By signing up, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-heading underline font-medium"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms"
                  className="text-heading underline font-medium"
                >
                  Condition of use
                </Link>{" "}
                and Privacy policy. See{" "}
                <Link
                  href="/terms"
                  className="text-primary underline font-medium"
                >
                  here
                </Link>
                .
              </>
            ) : (
              <>
                By using{" "}
                <span className="font-semibold text-foreground">jooav.com</span>
                , you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-heading underline font-medium"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms"
                  className="text-heading underline font-medium"
                >
                  Condition of use
                </Link>{" "}
                and Privacy policy.
              </>
            )}
          </p>
        </div>
      </div>

      {/* ─────────────────────────────── RIGHT PANEL ────────────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden bg-gradient-to-b from-blue-100 to-transparent">
        <div className="w-full overflow-hidden flex-shrink-0">
          <Image
            src="/auth/auth-illustration.svg"
            alt=""
            width={752}
            height={150}
            className="w-full h-auto object-cover object-top"
            priority
            aria-hidden
          />
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-3 text-center px-10 pb-4">
          <Image
            src="/auth/jooav-logo.svg"
            alt="Jooav"
            width={110}
            height={30}
            className="pb-4"
          />
          <p className="text-foreground text-sm font-medium leading-relaxed max-w-[372px]">
            One-stop FMCG marketplace, for the wholesalers who want efficiency
            and reliability.
          </p>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between rounded-xl bg-nominal-background p-main h-pill text-sm shadow-card border-b-2 border-blue-100 max-w-[500px] mx-auto">
            {isLogin && (
              <p className="text-foreground">
                No account yet?{" "}
                <Link
                  href={
                    fromCart === "true"
                      ? "/register?fromCart=true"
                      : "/register"
                  }
                  className="text-heading font-semibold hover:underline"
                >
                  Create account
                </Link>
              </p>
            )}
            {isRegister && (
              <p className="text-foreground">
                Have an account?{" "}
                <Link
                  href={fromCart === "true" ? "/login?fromCart=true" : "/login"}
                  className="text-heading font-body font-bold text-button leading-none tracking-button text-cap-trim hover:underline"
                >
                  Login
                </Link>
              </p>
            )}
            {!isLogin && !isRegister && (
              <p className="text-foreground">
                <Link
                  href={fromCart === "true" ? "/login?fromCart=true" : "/login"}
                  className="text-primary hover:underline"
                >
                  Back to login
                </Link>
              </p>
            )}

            <nav className="flex gap-5 text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact us
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingScreen className="w-full min-h-screen" />}>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </Suspense>
  );
}