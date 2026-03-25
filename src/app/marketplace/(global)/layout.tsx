"use client";

import MarketplaceNavbar from "@/components/general/MarketplaceNavbar";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import LoadingScreen from "@/layouts/LoadingScreen";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthHydration({isMarketPlace: true});
  // const auth = useSelector((state: RootState) => state.auth);

  // if (auth.isUserLoading) {
  //   return <LoadingScreen className="w-full min-h-screen" />;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 sm:px-main lg:px-layout py-main">
      <MarketplaceNavbar />
      <main className="flex-1 w-full mx-auto py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
