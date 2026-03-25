"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchCategories } from '@/features/marketplace/services/marketplace.api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const CategoriesDropdown = () => {
  const {data} = useFetchCategories()
  const router = useRouter()
  const categories = data?.data
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="hover:text-primary transition-colors p-sm cursor-pointer">
          <span className="py-4 px-2 leading-[1.5] tracking-[0.04em] font-medium text-body">
            Shop by categories
          </span>
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="gap-5 p-lg! rounded-lg! max-w-[1015px] w-full overflow-y-auto user-dropdown"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-sm p-sm">
          {categories?.map((c, i) => {
            const isLast = i === categories?.length - 1
            return (
              <DropdownMenuItem
                key={i}
                className={cn(
                  "border-b border-border-main max-w-[293px] w-full rounded-md mt-2 py-sm h-auto cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
                )}
                onClick={() => router.push(`/marketplace/${c.id}`)}
              >
                <div className="flex items-center gap-main">
                  <div className="h-8 w-8 border-[1.5px] border-[#EDEDED] bg-storey-foreground rounded-lg"></div>
                  <p className="text-body-passive leading-[1.2] tracking-[0.04em] font-medium text-[15px] ">
                    {c.name}
                  </p>
                </div>
                
              </DropdownMenuItem>
            );
          } 
          
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CategoriesDropdown