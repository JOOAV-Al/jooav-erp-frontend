import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

interface EmptyStateProps {
  header: string;
  description: string;
  cta?: string;
  image?: string;
  showCTA?: boolean;
  onCTAClick?: () => void;
}
const EmptyState = ({
  header,
  description,
  cta,
  image = "",
  onCTAClick,
  showCTA = true,
}: EmptyStateProps) => {
  return (
    <div className="flex justify-center my-10 px-sm">
      <div className="flex flex-col items-center gap-5 px-main py-1 rounded-2xl bg-transparent max-w-[372px] w-full">
        <Image
          src={"/dashboard/empty-state.svg"}
          alt={header}
          height={72}
          width={72}
          className="rounded-2xl bg-storey-foreground"
        />
        <div className="py-sm px-main flex flex-col gap-5 max-w-[350px] text-center">
          <h4 className="text-heading">{header}</h4>
          <p className="text-body-passive text-[15px] font-medium leading-[1.5] tracking-[0.03em] text-wrap">
            {description}
          </p>
        </div>
        {showCTA && cta && (
          <Button
            size={"neutral"}
            type="submit"
            className="w-full mx-auto"
            onClick={onCTAClick}
          >
            <span className="h-4 w-5 flex justify-center">
              <Plus size={16} />
            </span>
            {cta}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
