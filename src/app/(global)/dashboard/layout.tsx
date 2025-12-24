"use client";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import LoadingScreen from "@/layouts/LoadingScreen";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthHydration();
  const auth = useSelector((state: RootState) => state.auth);
  return <div>{auth.isUserLoading ? <LoadingScreen /> : <>{children}</>}</div>;
};

export default DashboardLayout;
