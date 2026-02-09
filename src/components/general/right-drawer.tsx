"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const RightDrawer = DialogPrimitive.Root;

const RightDrawerTrigger = DialogPrimitive.Trigger;

const RightDrawerPortal = DialogPrimitive.Portal;

const RightDrawerClose = DialogPrimitive.Close;

const RightDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
RightDrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const RightDrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    isCustomWidth?: boolean;
    customWidthStyle?: string;
    customImage?: string;
    aspectRatio?: string;
  }
>(
  (
    {
      className,
      children,
      isCustomWidth = false,
      customWidthStyle,
      customImage,
      ...props
    },
    ref,
  ) => (
    <RightDrawerPortal>
      <RightDrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-300",
          // Position from right with spacing
          `top-3 right-3 bottom-3 w-[calc(100%-2rem)] ${isCustomWidth ? `${customWidthStyle}` : "aspect-508/958 xl:aspect-auto max-w-sm md:max-w-md lg:max-w-[508px]"} w-[calc(100%-2rem)] rounded-2xl border`,
          // Slide animations from right
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          className,
        )}
        {...props}
      >
        <div
          style={{ background: customImage ? `url(${customImage})` : `url("/dashboard/drawer-top-img.svg")` }}
          className="h-24 rounded-t-2xl p-main"
        >
          <div className="flex justify-between items-center">
            <div></div>
            <RightDrawerClose>
              <div className="size-9 rounded-full p-sm sidebar-link bg-white hover:bg-storey-foreground flex justify-center items-center text-outline cursor-pointer">
                <X size={20} />
              </div>
            </RightDrawerClose>
          </div>
        </div>
        {children}
      </DialogPrimitive.Content>
    </RightDrawerPortal>
  ),
);
RightDrawerContent.displayName = DialogPrimitive.Content.displayName;

const RightDrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6 border-b", className)}
    {...props}
  />
);
RightDrawerHeader.displayName = "RightDrawerHeader";

const RightDrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 px-lg pt-md pb-lg mt-auto gap-3",
      className,
    )}
    {...props}
  />
);
RightDrawerFooter.displayName = "RightDrawerFooter";

const RightDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
RightDrawerTitle.displayName = DialogPrimitive.Title.displayName;

const RightDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
RightDrawerDescription.displayName = DialogPrimitive.Description.displayName;

const RightDrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
);
RightDrawerBody.displayName = "RightDrawerBody";

export {
  RightDrawer,
  RightDrawerPortal,
  RightDrawerOverlay,
  RightDrawerTrigger,
  RightDrawerClose,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerFooter,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
};
