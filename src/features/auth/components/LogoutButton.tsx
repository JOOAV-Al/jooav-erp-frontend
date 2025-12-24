"use client"
import { useLogout } from "@/features/auth/services/auth.api";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie"

const LogoutButton = () => {
  const { mutateAsync: logoutUser, isPending } = useLogout();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await logoutUser();
    } finally {
      Cookies.remove("refreshToken");
      Cookies.remove("authToken");
      router.replace("/login");
    }
  };

  return <Button disabled={isPending} onClick={handleLogout}>{isPending ? "Goodbye..." : "Logout"}</Button>;
};

export default LogoutButton