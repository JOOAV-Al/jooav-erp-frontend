import React from "react";
import { Upload } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";
import { FileDataProps } from "@/features/uploads/types";

interface FileUploadAreaProps {
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  openFileDialog: () => void;
  handleRemove?: () => void;
  isDragActive: boolean;
  uploading: boolean;
  removing: boolean;
  acceptedFormats?: string;
  title?: string;
  description?: string;
  isSingularUpload?: boolean;
  isNewUpload?: boolean;
  file?: FileDataProps;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  getRootProps,
  getInputProps,
  openFileDialog,
  handleRemove,
  isDragActive,
  uploading,
  removing,
  acceptedFormats = "jpeg, png, webp, pdf, docx",
  title = "Drag & drop or",
  description,
  isSingularUpload = false,
  isNewUpload = false,
  file,
}) => {
  return (
    <div
      {...getRootProps()}
      className={`bg-gray-50 flex flex-col justify-center items-center py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragActive ? "border-primary-500 bg-primary-50/50" : "border-gray-200"
      }`}
    >
      <input {...getInputProps()} />

      <div className="h-18 w-18 flex items-center justify-center bg-primary-50 rounded-[10px] mb-4">
        {uploading || removing ? (
          <Spinner className={`${removing ? "text-shadow-red-500" : "text-primary"}`} />
        ) : file && file?.url && isSingularUpload ? (
          <div>
            <Image
              src={file?.url ?? ""}
              alt={file?.title ?? "file"}
              width={64}
              height={64}
            />
          </div>
        ) : (
          <Upload
            size={32}
            className={`transition-colors ${
              isDragActive ? "text-primary-600" : "text-primary-500"
            }`}
          />
        )}
      </div>

      <div className="text-center font-satoshi font-medium">
        <p className="text-gray-500 mb-1">
          {title}{" "}
          <span
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
            className="text-primary-500 cursor-pointer hover:underline font-medium"
          >
            Upload File
          </span>
        </p>
        <p className="body-mobile text-gray-400">
          {description || `Supported formats: ${acceptedFormats}`}
        </p>
        {file?.url && isSingularUpload && (
          <div>
            <p className="body-mobile text-black my-2">
              Uploaded: <strong>{file.title}</strong>
            </p>
            {isNewUpload && (
              <Button
                type="button"
                onClick={handleRemove}
                className="text-white bg-red-500 hover:bg-red-600 font-medium font-satoshi"
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadArea;
