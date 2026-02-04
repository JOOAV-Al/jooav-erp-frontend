import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";

interface FormDropdownProps {
  deleteAction?: () => void;
  publish?: () => void;
  unpublish?: () => void;
  clear?: () => void;
}
function FormDropdown({
  deleteAction,
  publish,
  unpublish,
  clear
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
          "flex flex-col gap-5 p-sm! rounded-lg! max-h-90 select-dropdown-shadow"
        }
      >
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
        {clear && (
          <DropdownMenuItem onClick={() => clear?.()}>Clear</DropdownMenuItem>
        )}
        {deleteAction && (
          <DropdownMenuItem
            className="text-destructive!"
            onClick={() => deleteAction?.()}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default FormDropdown