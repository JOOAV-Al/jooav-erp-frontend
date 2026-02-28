import { Button } from "@/components/ui/button";
import { truncateText } from "@/lib/utils";
import { CheckCheck, Copy, Link2 } from "lucide-react";
import React, { useState } from "react";

interface CopyLinkBoxProps {
  link?: string;
  onShare?: () => void;
  shareBtnIcon?: React.ReactNode;
}

const CopyLinkBox = ({ link, onShare, shareBtnIcon }: CopyLinkBoxProps) => {
  const [showCopied, setShowCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text ?? "");
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 1000);
  };
  return (
    <div className="w-full bg-white rounded-xl p-sm flex flex-col gap-6 shadow-input mt-2">
      <div className="w-full bg-storey-foreground rounded-lg p-md flex flex-col gap-4 shadow-input">
        <h6 className="font-mono text-heading font-normal tracking-[0.08em] leading-[1.2] text-xs pt-3 pb-sm">
          COPY LOGIN LINK
        </h6>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-[8px] min-w-0 w-full">
            <div className="p-3 w-5.5 h-5.5 flex-shrink-0">
              <Link2 strokeWidth={2} className="text-brand-primary w-5 h-5" />
            </div>
            <p className="flex-1 min-w-0 truncate overflow-hidden text-clip whitespace-nowrap text-brand-primary text-sm mt-[3px]">
              {truncateText(link ?? "", 45)}
            </p>
          </div>
          <div
            onClick={() => handleCopy(link ?? "")}
            className="shrink-0 p-3 w-6.5 h-6.5 bg-tag-added rounded-main table-selected flex justify-center items-center cursor-pointer"
          >
            {showCopied ? (
              <CheckCheck
                strokeWidth={2}
                className="text-brand-primary w-3.5 h-3.5"
              />
            ) : (
              <Copy
                strokeWidth={2}
                className="text-brand-primary w-3.5 h-3.5"
              />
            )}
          </div>
        </div>
      </div>
      {onShare && (
        <Button
          type={"button"}
          size={"neutral"}
          variant="input"
          // disabled={!!link}
          onClick={onShare}
          className="shadow-input! font-semibold"
        >
          <span className="px-2">{shareBtnIcon && shareBtnIcon}</span>
          <span className="px-2 py-4 text-[15px]">Share link</span>
        </Button>
      )}
    </div>
  );
};

export default CopyLinkBox;
