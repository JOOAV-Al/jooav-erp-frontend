"use client";
import CustomLoader from "@/components/general/CustomLoader";
// import DashboardDialog from "@/components/general/DashboardDialog";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const SuperAdminDashboardHome = () => {
  useAuthHydration();
  const user = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = useState<boolean>(true);
  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <h2>
          Hi {user?.firstName} {user?.lastName}
        </h2>
        <LogoutButton />
      </div>
      <DashboardDrawer
        openDrawer={() => setOpen(!open)}
        isOpen={open}
        children={<div>
          <h3>Lets get started</h3>
        </div>}
      />
    </div>
  );
};

export default SuperAdminDashboardHome;
