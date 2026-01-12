"use client";
import DashboardTopBar from "@/components/general/DashboardTopBar";
import Sidebar from "@/components/general/Sidebar";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import LoadingScreen from "@/layouts/LoadingScreen";
import { RootState } from "@/redux/store";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthHydration();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/dashboard";
  // const user = useSelector((state: RootState) => state.auth.user);
  const auth = useSelector((state: RootState) => state.auth);

  const toggleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const shouldRenderIcon = isSidebarHidden || !isSidebarOpen;
  const visibilityClass = isSidebarHidden ? "block" : "block md:hidden";
  const handleSidebarToggleWithIcon = () => {
    if (isSidebarHidden) {
      setIsSidebarHidden(false);
      // setIsSidebarOpen(true);
    }
    setIsSidebarOpen(true);
  };

  const getPageHeading = (): string => {
    return pathname.startsWith("/dashboard/manufacturer")
      ? "Manage manufacturer"
      : pathname.startsWith("/dashboard/brands")
      ? "Manage brands"
      : "Home";
  };
  return (
    <div className="flex min-h-screen overflow-hidden">
      {auth.isUserLoading ? (
        <LoadingScreen className="w-full" />
      ) : (
        <>
          {/* Sidebar */}

          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isHidden={isSidebarHidden}
            hideSidebar={() => setIsSidebarHidden(true)}
            isCollapsed={isCollapsed}
            setIsCollapsed={toggleSidebarCollapse}
          />

          {/* Main Content */}
          <div
            className={`flex flex-col flex-1 overflow-auto mt-3 mr-3 ${
              isCollapsed ? "" : "rounded-t-2xl"
            } bg-white ${
              isSidebarHidden
                ? "md:ml-0"
                : isCollapsed
                ? "md:ml-[80]"
                : "md:ml-57.5"
            }`}
          >
            <DashboardTopBar
              toggleSidebar={handleSidebarToggleWithIcon}
              shouldRenderIcon={shouldRenderIcon}
              visibilityClass={visibilityClass}
              pageHeading={getPageHeading()}
            />
            <main className="flex-1">{children}</main>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
