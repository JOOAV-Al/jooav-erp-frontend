"use client";
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
            className={`flex flex-col flex-1 overflow-auto p-4 md:p-6 ${
              isSidebarHidden
                ? "md:ml-0"
                : isCollapsed
                ? "md:ml-[100px]"
                : "md:ml-62"
            }`}
          >
            {shouldRenderIcon && (
              <div
                className={`${visibilityClass} h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-[#E5E7EB] rounded-[10px]`}
              >
                <Menu
                  className={`cursor-pointer text-black`}
                  size={22}
                  onClick={() => {
                    if (isSidebarHidden) {
                      setIsSidebarHidden(false);
                      // setIsSidebarOpen(true);
                    }
                    setIsSidebarOpen(true);
                  }}
                />
              </div>
            )}
            <main className="flex-1">{children}</main>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
