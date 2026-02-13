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
  // New props for dual actions
  secondarySubmitLabel?: string;
  secondarySubmitLoading?: boolean;
  submitAction?: "primary" | "secondary";
  onSubmitActionChange?: (action: "primary" | "secondary") => void;
  primaryBtnIcon?: React.ReactNode;
  secondaryBtnIcon?: React.ReactNode;
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
  secondarySubmitLabel,
  secondarySubmitLoading = false,
  submitAction,
  onSubmitActionChange,
  primaryBtnIcon,
  secondaryBtnIcon,
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

        {/*
          RightDrawerBody fills the remaining height between the top image band
          and the footer. It is itself a flex column so that:
          - DrawerTabs (which manages its own internal scroll) can stretch to fill it
          - A plain component passed as children will also scroll naturally
        */}
        <RightDrawerBody className="flex flex-col">{children}</RightDrawerBody>

        {showFooter && (
          <RightDrawerFooter>
            {/* Secondary action button (e.g., "Publish") */}
            {secondarySubmitLabel ? (
              <Button
                type={submitFormId ? "submit" : "button"}
                form={submitFormId}
                size={"neutral"}
                variant="neutral"
                disabled={secondarySubmitLoading || submitLoading}
                onClick={() => onSubmitActionChange?.("secondary")}
              >
                <span className="px-2">
                  {secondaryBtnIcon && secondaryBtnIcon}
                </span>
                <span className="px-2 py-4">
                  {secondarySubmitLoading && submitAction === "secondary"
                    ? "Loading..."
                    : secondarySubmitLabel}
                </span>
              </Button>
            ) : (
              <RightDrawerClose asChild>
                <Button size={"neutral"} variant="neutral">
                  Cancel
                </Button>
              </RightDrawerClose>
            )}

            {/* Submit button targets the inner form using the form attribute */}
            {/* Primary action button (e.g., "Queue" or "Save") */}
            <Button
              type={submitFormId ? "submit" : "button"}
              form={submitFormId}
              size={"neutral"}
              className="mr-2"
              disabled={submitLoading || secondarySubmitLoading}
              onClick={() => onSubmitActionChange?.("primary")}
            >
              <span className="px-2">{primaryBtnIcon && primaryBtnIcon}</span>
              <span className="px-2 py-4">
                {submitLoading && submitAction === "primary"
                  ? "Loading..."
                  : submitLabel}
              </span>
            </Button>
          </RightDrawerFooter>
        )}
      </RightDrawerContent>
    </RightDrawer>
  );
};

export default DashboardDrawer;
