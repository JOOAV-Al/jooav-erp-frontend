"use client";

import CustomLoader from "@/components/general/CustomLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface SidebarLinkProps {
  href: string;
  label: string;
  Icon: React.ElementType;
  isCollapsed: boolean;
}

export default function SidebarLink({
  href,
  label,
  Icon,
  isCollapsed,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();

  // Accommodate both student and sponsor dashboards
  const isActive =
    (href === "/dashboard" && pathname === "/dashboard") ||
    (pathname.startsWith(href) && href !== "/dashboard");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link className="block" href={href} onClick={handleClick}>
      <div
        className={`group flex items-center gap-3 px-4 py-2 rounded hover:bg-primary-500 hover:text-white transition-colors cursor-pointer ${
          isActive ? "bg-brand-primary font-bold text-white" : ""
        } ${isCollapsed ? "w-fit" : ""}`}
      >
        {isTransitioning ? (
          <CustomLoader />
        ) : (
          <>
            {!isCollapsed ? (
              <Icon
                size={24}
                className={`transition-colors ${
                  isActive ? "text-white" : "text-[#6B7280]"
                } group-hover:text-white`}
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    size={24}
                    className={`transition-colors ${
                      isActive ? "text-white" : "text-[#6B7280]"
                    } group-hover:text-white`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </>
        )}
        {!isCollapsed && <p className="sidebar-text">{label}</p>}
      </div>
    </Link>
  );
}
