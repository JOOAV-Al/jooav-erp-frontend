import { Menu } from "lucide-react";
import React from "react";

interface DashboardTopBarProps {
  shouldRenderIcon?: boolean;
  // isSidebarHidden?: boolean;
  toggleSidebar?: () => void;
  visibilityClass?: string;
  pageHeading?: string;
}
const DashboardTopBar = ({
  shouldRenderIcon,
  visibilityClass,
  toggleSidebar,
  pageHeading,
}: DashboardTopBarProps) => {
  return (
    <div className="py-md px-xl max-h-15 h-full border-b-[0.5] border-[#EDEDED] flex justify-between gap-main items-center">
      <div className="flex justify-between gap-main items-center">
        {shouldRenderIcon && (
          <div
            className={`${visibilityClass} h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-[#E5E7EB] rounded-[10px]`}
          >
            <Menu
              className={`cursor-pointer text-black`}
              size={22}
              onClick={toggleSidebar}
            />
          </div>
        )}
        <h3 className="py-5 hidden smd:block">{pageHeading}</h3>
      </div>
      <div className="size-9 rounded-full p-sm sidebar-link bg-storey-foreground"></div>
    </div>
  );
};

export default DashboardTopBar;
