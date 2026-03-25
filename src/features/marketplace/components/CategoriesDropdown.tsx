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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-sm! rounded-lg! max-h-90 max-w-[1015px] w-full overflow-y-auto user-dropdown"
      >
        {categories?.map((c, i) => (
          <DropdownMenuItem
            key={i}
            className={cn(
              "rounded-md py-5 px-sm h-[22px] cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
            )}
            onClick={() => router.push(`/marketplace/${c.id}`)}
          >
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CategoriesDropdown