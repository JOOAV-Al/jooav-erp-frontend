/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import {
  // CreditCard,
  // Home,
  // LibraryBig,
  // NotebookPen,
  // PencilRuler,
  // Table,
  // TabletSmartphone,
  // X,
  // Settings,
  // LogOut,
  PanelRightOpen,
  PanelRightClose,
  // MessageCircleMoreIcon,
  // ChartLineIcon,
  LayoutDashboard,
  Bell,
  ShoppingBag,
  // FolderPen,
  // FolderTree,
  DiamondPlus,
  GitBranchPlus,
  Workflow,
  UserPlus,
  UserCog,
  // UserStar,
  // Users,
  PackagePlus,
  Bike,
  CheckCheck,
  ListTree,
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
// import Cookies from "js-cookie";
// import { RootState } from "@/store";
// import { truncateText } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/redux/store";
import { HideIfRole } from "@/lib/rbac/HideIfRole";
// import { logout } from "@/redux/slices/authSlice";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isHidden: boolean;
  hideSidebar: () => void;
  isCollapsed: boolean;
  setIsCollapsed?: () => void;
}
const links = {
  overview: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Notification",
      href: "/dashboard/notification",
      icon: Bell,
    },
  ],
  order: [
    {
      label: "Order log",
      href: "/dashboard/order-logs",
      icon: ShoppingBag,
    },
    // {
    //   label: "Logistics",
    //   href: "/dashboard/logistics",
    //   icon: Bike,
    // },
    {
      label: "Fulfilled",
      href: "/dashboard/fulfilled-orders",
      icon: CheckCheck,
    },
  ],
  catalog: [
    {
      label: "Product",
      href: "/dashboard/product",
      icon: PackagePlus,
    },
    {
      label: "Manufacturer",
      href: "/dashboard/manufacturer",
      icon: DiamondPlus,
    },
    {
      label: "Brand",
      href: "/dashboard/brand",
      icon: GitBranchPlus,
    },
    {
      label: "Variant",
      href: "/dashboard/variant",
      icon: Workflow,
    },
    {
      label: "Category",
      href: "/dashboard/category",
      icon: ListTree,
    },
  ],
  user: [
    {
      label: "Users",
      href: "/dashboard/users",
      icon: UserPlus,
    },
    {
      label: "Roles & Permissions",
      href: "/dashboard/roles-and-permissions",
      icon: UserCog,
    },
  ],
};

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
          fixed top-0 left-0 z-10 h-screen bg-background
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-300 ease-in-out
          md:translate-x-0
          md:fixed md:h-screen md:overflow-y-auto
          ${isCollapsed ? "max-w-17" : "max-w-57.5"} w-full
        `}
      >
        <div className={`flex flex-col gap-main h-full`}>
          {/* Top Section */}
          <div
            className={`flex-none flex items-center justify-between border-b border-border-main ${
              isCollapsed ? "justify-center" : ""
            } py-lg max-h-18 h-full px-main`}
          >
            {!isCollapsed && (
              <Image
                src={"/auth/jooav-logo.svg"}
                alt="JOOAV Logo"
                width={75.58}
                height={20}
              />
            )}
            <div className={`flex gap-2`}>
              {/* Collapse/Expand Button */}
              <button
                onClick={setIsCollapsed}
                className={`${
                  isCollapsed ? "px-3" : "px-sm"
                } rounded hover:bg-gray-200 cursor-pointer text-outline`}
              >
                {isCollapsed ? (
                  <PanelRightClose strokeWidth={2} size={24} />
                ) : (
                  <PanelRightOpen strokeWidth={2} size={24} />
                )}
              </button>
              {/* Hide Button */}
              {/* <button
                // onClick={() => setIsHidden(true)}
                onClick={hideSidebar}
                className={`${
                  isCollapsed ? "px-3" : "px-sm"
                } rounded hover:bg-gray-200 cursor-pointer text-outline-passive`}
              >
                <X size={24} color="red" />
              </button> */}
            </div>
          </div>
          {/* Divider */}
          <ScrollArea isSidebar className="flex-1 min-h-52 min-w-0">
            <div className="py-main flex flex-col gap-sm px-md">
              {/* Overview */}
              <div
                className={`flex flex-col gap-7 ${
                  isCollapsed ? "border-t-2 border-border-main pt-main" : ""
                }`}
              >
                {!isCollapsed && (
                  <h6 className="font-mono leading-[1.2] tracking-[0.08em] text-[12px] text-body-passive">
                    OVERVIEW
                  </h6>
                )}
                <nav className="flex flex-col gap-4">
                  {links.overview.map((link) => (
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

              {/* Order */}
              <HideIfRole roles={["PROCUREMENT_OFFICER"]}>
                <div
                  className={`flex flex-col gap-7 ${
                    isCollapsed ? "border-t-2 border-[#EDEDED] pt-main" : ""
                  }`}
                >
                  {!isCollapsed && (
                    <h6 className="font-mono leading-[1.2] tracking-[0.08em] text-[12px] text-body-passive">
                      ORDER
                    </h6>
                  )}
                  <nav className="flex flex-col gap-4">
                    {links.order.map((link) => (
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
              </HideIfRole>

              {/* Catalog */}
              <HideIfRole roles={["PROCUREMENT_OFFICER"]}>
                <div
                  className={`flex flex-col gap-7 ${
                    isCollapsed ? "border-t-2 border-[#EDEDED] pt-main" : ""
                  }`}
                >
                  {!isCollapsed && (
                    <h6 className="font-mono leading-[1.2] tracking-[0.08em] text-[12px] text-body-passive">
                      CATALOG
                    </h6>
                  )}
                  <nav className="flex flex-col gap-4">
                    {links.catalog.map((link) => (
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
              </HideIfRole>

              {/* Users */}
              <HideIfRole roles={["PROCUREMENT_OFFICER"]}>
                <div
                  className={`flex flex-col gap-7 ${
                    isCollapsed ? "border-t-2 border-[#EDEDED] pt-main" : ""
                  }`}
                >
                  {!isCollapsed && (
                    <h6 className="font-mono leading-[1.2] tracking-[0.08em] text-[12px] text-body-passive">
                      USER
                    </h6>
                  )}
                  <nav className="flex flex-col gap-4">
                    {links.user.map((link) => (
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
              </HideIfRole>
            </div>
          </ScrollArea>
          {/* Banner section */}
          <div className="flex-none p-sm">
            <div className="w-full rounded-lg">
              <Image
                height={150}
                width={300}
                src={
                  isCollapsed
                    ? "/dashboard/sidebar-banner-col.svg"
                    : "/dashboard/sidebar-banner.svg"
                }
                alt="sidebar image"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export { links };
