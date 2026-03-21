"use client";

import MarketplaceNavbar from "@/components/general/MarketplaceNavbar";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import LoadingScreen from "@/layouts/LoadingScreen";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // useAuthHydration();
  // const auth = useSelector((state: RootState) => state.auth);

  // if (auth.isUserLoading) {
  //   return <LoadingScreen className="w-full min-h-screen" />;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-white py-3">
      <MarketplaceNavbar />
      <main className="flex-1 max-w-app w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
