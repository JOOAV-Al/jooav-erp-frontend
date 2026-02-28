"use client";

import CustomLoader from "@/components/general/CustomLoader";
import Spinner from "@/components/general/Spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface SidebarLinkProps {
  href: string;
  label: string;
  className?: string;
  Icon: React.ElementType;
  isCollapsed: boolean;
}

export default function SidebarLink({
  href,
  label,
  className,
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
    <Link
      className={`block w-full ${
        isCollapsed ? "mr-2 max-w-15.5" : "max-w-full"
      } ${className}`}
      href={href}
      onClick={handleClick}
    >
      <div
        // hover:text-nominal-input-hover
        className={`group flex items-center gap-6 px-sm py-5 rounded-md hover:bg-[#EDEDED] transition-colors cursor-pointer ${
          isActive ? "bg-[#EDEDED] sidebar-link font-medium" : "font-medium"
        } ${isCollapsed ? "w-fit mx-auto" : ""}`}
      >
        {/* {isTransitioning ? (
          <Spinner />
        ) : (
          <> */}
        {!isCollapsed ? (
          <Icon
            size={18}
            strokeWidth={2}
            className={`transition-colors ${
              isActive ? "text-outline" : "text-outline-passive"
            } group-hover:text-outline`}
          />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild className="">
              <Icon
                strokeWidth={2}
                size={18}
                className={`transition-colors ${
                  isActive ? "text-outline" : "text-outline-passive"
                } group-hover:text-outline`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
          //   )}
          // </>
        )}
        {!isCollapsed && (
          <p
            className={`${
              isActive
                ? "text-body"
                : "text-body group-hover:text-body w-fit"
            } text-[15px] leading-[1.2] tracking-[0.04em]`}
          >
            {label}
          </p>
        )}
      </div>
    </Link>
  );
}
