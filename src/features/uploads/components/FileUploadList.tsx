import Image from "next/image";
import { Trash2 } from "lucide-react";
import { formatBytesToKB } from "@/lib/utils";
import Spinner from "@/components/general/Spinner";
import { FileDataProps } from "@/features/uploads/types";

interface FileUploadListProps {
  files: FileDataProps[];
  fileProgress: { [key: string]: number };
  removing: boolean;
  operationId: string;
  watchedTitle: string;
  handleRemove: (publicId: string) => void;
}

const FileUploadList = ({
  files,
  fileProgress,
  removing,
  operationId,
  watchedTitle,
  handleRemove,
}: FileUploadListProps) => (
  <div className="mt-4 flex flex-col gap-6">
    {files.map((f, idx) => (
      <div key={f.publicId} className="flex w-full gap-2 mb-2">
        <div>
          <Image
            src={
              f.fileType?.startsWith("image")
                ? "/assets/dashboard/student/img.svg"
                : "/assets/dashboard/student/pdf.svg"
            }
            alt="file"
            width={42}
            height={52}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col w-full text-gray-500">
          <div className="flex justify-between">
            <p className="para">
              {watchedTitle?.trim() ? watchedTitle : `material ${idx + 1}`}
            </p>
            <div
              aria-disabled={removing}
              onClick={() => handleRemove(f.publicId)}
              className="h-6 w-6 flex items-center justify-center bg-red-50 rounded-[8px] cursor-pointer"
            >
              {removing && f.publicId === operationId ? (
                <Spinner className="h-4 w-4 text-red-500" />
              ) : (
                <Trash2 className="text-red-500" size={16} />
              )}
            </div>
          </div>
          <div className="flex justify-between body-mobile">
            <div className="flex items-center gap-4">
              <p className="paraMedium">{formatBytesToKB(f?.bytes)}</p>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
            </div>
            <p className="paraMedium">
              {fileProgress[f.publicId] !== undefined
                ? `${fileProgress[f.publicId]} %`
                : "100 %"}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default FileUploadList;
