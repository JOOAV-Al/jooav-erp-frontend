import { RightDrawerClose } from "@/components/general/right-drawer";
import Spinner from "@/components/general/Spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import React from "react";

export interface DrawerBoxContentProps {
  heading?: string;
  description?: string;
  content: React.ReactNode;
  actionDropdown?: React.ReactNode;
  statusTag?: React.ReactNode;
  loading?: boolean;
  fillHeight?: boolean;
  showClose?: boolean;
}
const DrawerBoxContent = ({
  heading,
  description,
  content,
  actionDropdown,
  statusTag,
  loading,
  fillHeight=false,
  showClose=false,
}: DrawerBoxContentProps) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 mt-0">
      {/* Tab heading + action dropdown — never scrolls */}
      <div className="px-xl pt-main shrink-0 flex justify-between items-center gap-5 pb-main">
        <div className={`flex flex-col gap-5 ${description && `py-sm`}`}>
          <div className="flex gap-[8px] items-center">
            <h4 className="leading-[1.2] tracking-[0.01em]">{heading ?? ""}</h4>
            {statusTag && <div>{statusTag}</div>}
          </div>
          {description && (
            <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
              {description}
            </p>
          )}
          {loading && <Spinner className="w-4 h-4" />}
        </div>
        {actionDropdown && <div>{actionDropdown}</div>}
        {showClose && (
          <RightDrawerClose>
            <div className="size-9 rounded-full p-sm sidebar-link bg-white hover:bg-storey-foreground flex justify-center items-center text-outline cursor-pointer">
              <X size={20} />
            </div>
          </RightDrawerClose>
        )}
      </div>

      {fillHeight ? (
        <div className="flex-1 min-h-0 px-xl overflow-hidden">{content}</div>
      ) : (
        <ScrollArea isSidebar className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-xl">{content}</div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DrawerBoxContent;
