import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

interface EmptyStateProps {
  header: string;
  description: string;
  cta?: string;
  image?: string;
  onCTAClick?: () => void;
}
const EmptyState = ({
  header,
  description,
  cta,
  image = "",
  onCTAClick,
}: EmptyStateProps) => {
  return (
    <div className="flex justify-center my-10  px-sm">
      <div className="flex flex-col items-center gap-main px-main py-1 rounded-2xl bg-transparent max-w-[372px] w-full">
        <Image
          src={""}
          alt={header}
          height={200}
          width={200}
          className="rounded-2xl bg-storey-foreground"
        />
        <div className="p-sm flex flex-col gap-6 max-w-[340px] text-center">
          <h3 className="text-heading">{header}</h3>
          <p className="text-body-passive font-medium">{description}</p>
        </div>
        <Button
          size={"neutral"}
          type="submit"
          className="w-full"
          onClick={onCTAClick}
        >
          <span className="h-4 w-5 flex justify-center">
            <Plus size={16} />
          </span>
          {cta}
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
