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
  X,
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
      href: "/dashboard/order-log",
      icon: ShoppingBag,
    },
    {
      label: "Logistics",
      href: "/dashboard/logistics",
      icon: Bike,
    },
    {
      label: "Fulfillment",
      href: "/dashboard/fulfillment",
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
        <div className={`flex flex-col gap-main overflow-y-auto h-full pl-3`}>
          {/* Top Section */}
          <div
            className={`flex items-center justify-between border-b border-border-main ${
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
                  <PanelRightClose size={24} />
                ) : (
                  <PanelRightOpen size={24} />
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
          <ScrollArea isSidebar className="min-h-72 w-full">
            <div className="pb-main py-2.5 flex flex-col gap-sm px-sm">
              {/* Overview */}
              <div
                className={`flex flex-col gap-7 ${
                  isCollapsed ? "border-t-2 border-border-main pt-main" : ""
                }`}
              >
                {!isCollapsed && (
                  <h6 className="font-mono leading-[1.2] text-sm text-body-passive mx-2">
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
              <div
                className={`flex flex-col gap-7 ${
                  isCollapsed ? "border-t-2 border-[#EDEDED] pt-main" : ""
                }`}
              >
                {!isCollapsed && (
                  <h6 className="font-mono leading-[1.2] text-sm text-body-passive mx-2">
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

              {/* Catalog */}
              <div
                className={`flex flex-col gap-7 ${
                  isCollapsed ? "border-t-2 border-[#EDEDED] pt-main" : ""
                }`}
              >
                {!isCollapsed && (
                  <h6 className="font-mono leading-[1.2] text-sm text-body-passive mx-2">
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

              {/* Users */}
              <div
                className={`flex flex-col gap-7 ${
                  isCollapsed ? "border-t-2 border-[#EDEDED] pt-main" : ""
                }`}
              >
                {!isCollapsed && (
                  <h6 className="font-mono leading-[1.2] text-sm text-body-passive mx-2">
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
            </div>
          </ScrollArea>
          <div className="py-main px-sm">
            <div className="w-full rounded-lg">
              <Image
                height={150}
                width={300}
                src={"/dashboard/drawer-top-img.svg"}
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
