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
}

const DashboardDrawer = ({
  children,
  openDrawer,
  isOpen,
}: DashboardDrawerProps) => {
  return (
    <RightDrawer open={isOpen} onOpenChange={openDrawer}>
      <RightDrawerTrigger asChild>
        <Button>Open</Button>
      </RightDrawerTrigger>
      <RightDrawerContent>
        <RightDrawerHeader>
          <RightDrawerTitle>Are you absolutely sure?</RightDrawerTitle>
          <RightDrawerDescription>
            This action cannot be undone.
          </RightDrawerDescription>
        </RightDrawerHeader>

        <RightDrawerBody>{children}</RightDrawerBody>

        <RightDrawerFooter>
          <Button>Submit</Button>
          <RightDrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </RightDrawerClose>
        </RightDrawerFooter>
      </RightDrawerContent>
    </RightDrawer>
  );
};

export default DashboardDrawer;