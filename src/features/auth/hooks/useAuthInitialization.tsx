/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { useFetchCurrentUser } from "../dashboard/general";
// import { logout, setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { normalizeRoleForRoute } from "@/lib/utils";
import { useFetchCurrentUser } from "@/features/auth/services/auth.api";
import { RootState } from "@/redux/store";
import { logout, setCredentials } from "@/redux/slices/authSlice";

interface JwtPayload {
  exp: number;
  iat: number;
  role: string;
  [key: string]: any;
}

interface TokenCheck {
  valid: boolean;
  expired: boolean;
  role?: string;
}

const isTokenValid = (token: string): TokenCheck => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // console.log(decoded);
    const now = Date.now() / 1000;
    return {
      valid: decoded.exp > now,
      expired: decoded.exp <= now,
      role: decoded.role,
    };
  } catch (e) {
    return { valid: false, expired: false };
  }
};

// Helper function to get the correct dashboard route
const getDashboardRoute = (role: string): string => {
  return `/${normalizeRoleForRoute(role)}/dashboard`;
};

// Helper function to get the correct signin route
const getSigninRoute = (role: string): string => {
  return `/${normalizeRoleForRoute(role)}/signin`;
};

export const useAuthInit = (expectedRole: string) => {
  const dispatch = useDispatch();
  const [token] = useState(Cookies.get("authToken"));
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { mutateAsync: fetchUser } = useFetchCurrentUser();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // 1) No token at all → sign-in
      if (!token) {
        return router.replace(getSigninRoute(expectedRole));
      }

      // 2) Decode & check expiry
      const { valid, expired, role } = isTokenValid(token);
      if (!valid || expired || !role) {
        Cookies.remove("authToken");
        dispatch(logout());
        return router.replace(getSigninRoute(expectedRole));
      }

      // 3) Check role compatibility
      const isRoleCompatible =
        role === expectedRole ||
        (expectedRole === "ADMIN" && role === "SUPERADMIN") ||
        (expectedRole === "GSUPERADMIN" && role === "GADMIN");

      if (!isRoleCompatible) {
        // Wrong role → send to *their* dashboard
        return router.replace(getDashboardRoute(role));
      }

      // 4) Fetch & hydrate Redux if needed
      if (!authUser) {
        try {
          const { data } = await fetchUser();
          dispatch(setCredentials({ token, user: data.data }));
        } catch {
          Cookies.remove("authToken");
          dispatch(logout());
          router.replace(getSigninRoute(expectedRole));
        }
      }
    };

    init();
  }, [token, authUser, expectedRole, router, dispatch, fetchUser]);
};
