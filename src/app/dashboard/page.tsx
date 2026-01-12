"use client";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const SuperAdminDashboardHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full">
      
      <div>
        <h2>
          Hi {user?.firstName} {user?.lastName}
        </h2>
        <LogoutButton />
      </div>
      
    </div>
  );
};

export default SuperAdminDashboardHome;
