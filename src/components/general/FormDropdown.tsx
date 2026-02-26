import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface FormDropdownProps {
  deleteAction?: () => void;
  publish?: () => void;
  unpublish?: () => void;
  onReset?: () => void;
  onMarkItemComplete?: () => void;
  onMarkItemPending?: () => void;
  onMarkItemCancelled?: () => void;
  onMarkItemInProgress?: () => void;
  heading?: string;
}
function FormDropdown({
  deleteAction,
  publish,
  unpublish,
  onReset,
  onMarkItemComplete,
  onMarkItemPending,
  onMarkItemCancelled,
  onMarkItemInProgress,
  heading="",
}: FormDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center py-1 px-2 gap-6 cursor-pointer">
          <MoreHorizontal className="h-5 w-5 ring-none! border-none!" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={
          "flex flex-col gap-5 p-sm! rounded-lg! max-h-90 select-dropdown-shadow min-w-[172px]"
        }
      >
        {heading && <h5 className="py-3">{heading}</h5>}
        {unpublish && (
          <DropdownMenuItem onClick={() => unpublish?.()}>
            Unpublish
          </DropdownMenuItem>
        )}
        {publish && (
          <DropdownMenuItem onClick={() => publish?.()}>
            Publish
          </DropdownMenuItem>
        )}
        {onReset && (
          <DropdownMenuItem onClick={() => onReset?.()}>Reset</DropdownMenuItem>
        )}
        {onMarkItemComplete && (
          <DropdownMenuItem
            useSelectShadow={false}
            className={
              "table-tag border-[0.5] border-border-accent! bg-tag-added! text-brand-primary! hover:bg-tag-added hover:text-brand-primary!"
            }
            onClick={() => {
              // e.stopPropagation();
              onMarkItemComplete();
            }}
          >
            Completed
          </DropdownMenuItem>
        )}
        {onMarkItemInProgress && (
          <DropdownMenuItem
            useSelectShadow={false}
            className={
              "table-tag border-[0.5] border-border-accent! bg-tag-queue! text-brand-signal! hover:bg-tag-queue hover:text-brand-signal!"
            }
            onClick={() => {
              // e.stopPropagation();
              onMarkItemInProgress();
            }}
          >
            In Progress
          </DropdownMenuItem>
        )}
        {onMarkItemPending && (
          <DropdownMenuItem
            useSelectShadow={false}
            className={
              "table-tag border-[0.5] border-border-accent! bg-tag-queue! text-destructive! hover:bg-tag-queue hover:text-destructive!"
            }
            onClick={() => {
              // e.stopPropagation();
              onMarkItemPending();
            }}
          >
            Pending
          </DropdownMenuItem>
        )}
        {onMarkItemCancelled && (
          <DropdownMenuItem
            useSelectShadow={false}
            className={
              "table-tag border-[0.5] border-border-accent! bg-[#F7F7F7]! text-body! hover:bg-[#F7F7F7] hover:text-body!"
            }
            onClick={() => {
              // e.stopPropagation();
              onMarkItemCancelled();
            }}
          >
            Cancelled
          </DropdownMenuItem>
        )}
        {deleteAction && (
          <DropdownMenuItem
            className="text-destructive! hover:text-destructive!"
            onClick={() => deleteAction?.()}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FormDropdown;
