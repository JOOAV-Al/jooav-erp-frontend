/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import {
  CreditCard,
  Home,
  LibraryBig,
  NotebookPen,
  PencilRuler,
  Table,
  TabletSmartphone,
  X,
  Settings,
  LogOut,
  PanelRightOpen,
  PanelRightClose,
  MessageCircleMoreIcon,
  ChartLineIcon,
  // Router,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
// import AuthLogo from "@/components/authentication/AuthLogo";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from '@/store';
import Cookies from "js-cookie";
// import { RootState } from "@/store";
// import { truncateText } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isHidden: boolean;
  hideSidebar: () => void;
  isCollapsed: boolean;
  setIsCollapsed?: () => void;
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  hideSidebar,
  isHidden,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  // const auth = useSelector((state: RootState) => state.auth);

  // Close sidebar on mobile (<768px) whenever the route changes
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [pathname]);

  const links = [
    {
      label: "Timetable",
      href: "/dashboard/timetable",
      icon: Table,
    },
    {
      label: "Learning Materials",
      href: "/dashboard/learning-materials",
      icon: LibraryBig,
    },
    {
      label: "Assignments",
      href: "/dashboard/assignments",
      icon: NotebookPen,
    },
    { label: "Exams", href: "/exams", icon: PencilRuler },
    {
      label: "Results",
      href: "/dashboard/results",
      icon: TabletSmartphone,
    },
    {
      label: "School Fees",
      href: "/dashboard/school-fees",
      icon: CreditCard,
    },
  ];

  if (isHidden) return null; // completely hidden

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-8 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-10 h-screen bg-white
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-300 ease-in-out
          md:translate-x-0
          md:fixed md:h-screen md:overflow-y-auto
          ${isCollapsed ? "max-w-[100px]" : "max-w-62"} w-full
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4 py-8">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {!isCollapsed && (
              <Image
                src={"/auth/jooav-logo.svg"}
                alt="JOOAV Logo"
                width={90.7}
                height={24}
                className="py-xl"
              />
            )}
            <div className="flex gap-2">
              {/* Collapse/Expand Button */}
              <button
                onClick={setIsCollapsed}
                className="p-1 rounded hover:bg-gray-200 cursor-pointer"
              >
                {isCollapsed ? (
                  <PanelRightClose size={20} />
                ) : (
                  <PanelRightOpen size={20} />
                )}
              </button>
              {/* Hide Button */}
              <button
                // onClick={() => setIsHidden(true)}
                onClick={hideSidebar}
                className="p-1 rounded hover:bg-gray-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Divider */}
          {!isCollapsed && <div className="border-t" />}
          <ScrollArea className="min-h-72 w-full">
            {/* Home Link */}
            <nav className="mt-8">
              <SidebarLink
                href={"/dashboard"}
                label="Home"
                Icon={Home}
                isCollapsed={isCollapsed}
              />
            </nav>

            {/* Main Links */}
            <div
              className={`flex flex-col gap-2 ${
                isCollapsed ? "mt-4" : "mt-12"
              }`}
            >
              {!isCollapsed && <h4 className="paraMedium mb-2">MAIN MENU</h4>}
              <nav className="space-y-2 flex flex-col gap-2">
                {links.map((link) => (
                  <SidebarLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    Icon={link.icon}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </nav>
            </div>

            <div
              className={`flex flex-col gap-4 ${
                isCollapsed ? "mt-4 md:mt-4" : "mt-10 md:mt-12"
              }`}
            >
              {/* Settings Link */}
              <nav className="">
                <SidebarLink
                  href={"/dashboard/settings"}
                  label="Settings"
                  Icon={Settings}
                  isCollapsed={isCollapsed}
                />
              </nav>
              <div className="flex justify-between items-center border-t border-[#E4E7EC] pt-6">
                <div
                  className={`flex justify-between gap-1 ${
                    isCollapsed ? "mr-2 w-8 h-8" : "mr-0"
                  }`}
                >
                  <Image
                    src={"/assets/dashboard/student/avatar.svg"}
                    alt="User Avatar"
                    width={52}
                    height={52}
                    className="rounded-full object-cover"
                  />
                  {!isCollapsed && (
                    <div>
                      <h4 className="header4 text-[14px]! md:text-[18px]!">
                        {user?.firstName || ""}
                      </h4>
                      <p className="body-mobile text-[#667085]">
                        {user?.email}
                      </p>
                    </div>
                  )}
                </div>
                <div className="h-10 w-10 hover:bg-gray-100 hover:p-2 rounded-full flex justify-center items-center">
                  <LogOut
                    onClick={() => {
                      // Cookies.remove("authToken");
                      dispatch(logout());
                      router.push(`/${user?.role.toLowerCase()}/signin`);
                    }}
                    className="cursor-pointer text-[#667085] hover:text-red-500 font-semibold"
                    size={24}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
