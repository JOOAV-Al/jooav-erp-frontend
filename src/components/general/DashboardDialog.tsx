import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface DashboardDialogProps {
  children: React.ReactNode;
  openDialog: (isOpen: boolean) => void;
  isOpen: boolean;
}
const DashboardDialog = ({ children, openDialog, isOpen }: DashboardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={openDialog}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Submit</Button>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog