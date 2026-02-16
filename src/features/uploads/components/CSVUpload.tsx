import { Button } from "@/components/ui/button";
import { Plus, UploadCloud } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CSVUploadProps {
  catalog: string;
  onCTAClick?: () => void;
  onDownload?: () => void;
}
const CSVUpload = ({
  catalog,
  onCTAClick,
  onDownload,
}: CSVUploadProps) => {
  return (
    <div className="flex justify-center mt-10 mb-main px-sm">
      <div className="flex flex-col items-center gap-main px-main py-1 rounded-2xl bg-transparent max-w-[348px] w-full">
        <Image
          src={"/dashboard/import-csv.svg"}
          alt={catalog}
          height={72}
          width={72}
          className="rounded-2xl bg-storey-foreground"
        />
        <div className="p-sm flex flex-col gap-5 max-w-[340px] text-center">
          <h4 className="text-heading">{`Import ${catalog} CSV`}</h4>
          <p className="text-body-passive text-sm font-normal">
            CSV import populates all entity field across the {catalog} catalog.{" "}
            <br />
            <span
              onClick={onDownload}
              className="text-primary underline cursor-pointer"
            >
              Download template
            </span>
          </p>
        </div>
        <Button
          type={"button"}
          variant="neutral"
          size={"neutral"}
          onClick={onCTAClick}
        >
          <span className="px-2">
            <UploadCloud
              className="text-outline"
              size={17}
              strokeWidth={2.5}
            />
          </span>
          <span className="px-2 py-4 text-secondary-foreground">{"Import csv"}</span>
        </Button>
        {/* <Button
          variant="neutral"
          size={"neutral"}
          type="submit"
          className="w-fit"
          onClick={onCTAClick}
        >
          <span className="h-4 w-5 flex justify-center">
            <UploadCloud size={16} className="text-outline" />
          </span>
          {"Import csv"}
        </Button> */}
      </div>
    </div>
  );
};

export default CSVUpload