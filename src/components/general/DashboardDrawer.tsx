import React from "react";
import {
  RightDrawer,
  RightDrawerClose,
  RightDrawerContent,
  RightDrawerDescription,
  RightDrawerFooter,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerTrigger,
  RightDrawerBody,
} from "@/components/general/right-drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardDrawerProps {
  children: React.ReactNode;
  openDrawer: (isOpen: boolean) => void;
  isOpen: boolean;
  showTrigger?: boolean;
  showFooter?: boolean;
  // optional id of the form inside the drawer to target with footer submit
  submitFormId?: string;
  submitLabel?: string;
  // when true, disable footer submit and show loading label
  submitLoading?: boolean;
  isCustomWidth?: boolean;
  customWidthStyle?: string;
  customImage?: string;
}

const DashboardDrawer = ({
  children,
  openDrawer,
  isOpen,
  showTrigger = false,
  showFooter = true,
  submitFormId,
  submitLabel = "Submit",
  submitLoading = false,
  customWidthStyle,
  customImage,
  isCustomWidth = false,
}: DashboardDrawerProps) => {
  return (
    <RightDrawer open={isOpen} onOpenChange={openDrawer}>
      {showTrigger && (
        <RightDrawerTrigger asChild>
          <Button size={"neutral"} className="mr-2">
            <span className="h-4 w-5 flex justify-center">
              <Plus size={16} />
            </span>
            {"Add new"}
          </Button>
        </RightDrawerTrigger>
      )}
      <RightDrawerContent
        isCustomWidth={isCustomWidth}
        customWidthStyle={customWidthStyle}
        customImage={customImage}
      >
        <RightDrawerHeader className="hidden">
          <RightDrawerTitle>Are you absolutely sure?</RightDrawerTitle>
          <RightDrawerDescription>
            This action cannot be undone.
          </RightDrawerDescription>
        </RightDrawerHeader>

        <RightDrawerBody className="">{children}</RightDrawerBody>

        {showFooter && (
          <RightDrawerFooter>
            <RightDrawerClose asChild>
              <Button size={"neutral"} variant="neutral">
                Cancel
              </Button>
            </RightDrawerClose>
            {/* Submit button targets the inner form using the form attribute */}
            <Button
              type={submitFormId ? "submit" : "button"}
              form={submitFormId}
              size={"neutral"}
              className="mr-2"
              disabled={submitLoading}
            >
              <span className="">
                {submitLoading ? "Loading..." : submitLabel}
              </span>
            </Button>
          </RightDrawerFooter>
        )}
      </RightDrawerContent>
    </RightDrawer>
  );
};

export default DashboardDrawer;
