// import React from 'react'
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Button } from '@/components/ui/button';

// interface DashboardDrawerProps {
//   children: React.ReactNode;
//   openDrawer: (isOpen: boolean) => void;
//   isOpen: boolean;
// }
// const DashboardDrawer = ({ children, openDrawer, isOpen }: DashboardDrawerProps) => {
//   return (
//     <Drawer direction='right' open={isOpen} onOpenChange={openDrawer}>
//       <DrawerTrigger>Open</DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Are you absolutely sure?</DrawerTitle>
//           <DrawerDescription>This action cannot be undone.</DrawerDescription>
//         </DrawerHeader>
//         <DrawerFooter>
//           <Button>Submit</Button>
//           <DrawerClose>
//             <Button variant="outline">Cancel</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default DashboardDrawer


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

interface DashboardDrawerProps {
  children: React.ReactNode;
  openDrawer: (isOpen: boolean) => void;
  isOpen: boolean;
  showTrigger?: boolean;
  // optional id of the form inside the drawer to target with footer submit
  submitFormId?: string;
  submitLabel?: string;
  // when true, disable footer submit and show loading label
  submitLoading?: boolean;
}

const DashboardDrawer = ({
  children,
  openDrawer,
  isOpen,
  showTrigger = false,
  submitFormId,
  submitLabel = "Submit",
  submitLoading = false,
}: DashboardDrawerProps) => {
  return (
    <RightDrawer open={isOpen} onOpenChange={openDrawer}>
      {showTrigger && (
        <RightDrawerTrigger asChild>
          <Button>Open</Button>
        </RightDrawerTrigger>
      )}
      <RightDrawerContent>
        <RightDrawerHeader className="hidden">
          <RightDrawerTitle>Are you absolutely sure?</RightDrawerTitle>
          <RightDrawerDescription>
            This action cannot be undone.
          </RightDrawerDescription>
        </RightDrawerHeader>

        <RightDrawerBody className="">{children}</RightDrawerBody>

        <RightDrawerFooter>
          {/* Submit button targets the inner form using the form attribute */}
          <Button
            type={submitFormId ? "submit" : "button"}
            form={submitFormId}
            className="mr-2"
            disabled={submitLoading}
          >
            {submitLoading ? "Loading..." : submitLabel}
          </Button>

          <RightDrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </RightDrawerClose>
        </RightDrawerFooter>
      </RightDrawerContent>
    </RightDrawer>
  );
};

export default DashboardDrawer;