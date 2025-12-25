"use client";
import CustomLoader from "@/components/general/CustomLoader";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const SuperAdminDashboardHome = () => {
  useAuthHydration();
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h2>Hi {user?.firstName}</h2>
        <LogoutButton />
        {/* <CustomLoader /> */}
      </div>
    </div>
  );
};

export default SuperAdminDashboardHome;
