import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileDataProps } from "@/features/uploads/types";
import {
  useCreateFile,
  useCreateMultipleFiles,
  useDeleteFile,
} from "@/features/uploads/services/uploads.api";

interface UseFileUploadOptions {
  initialFiles?: FileDataProps[];
  acceptedFileTypes?: Record<string, string[]>;
  multiple?: boolean;
  maxFileSize?: number; // in bytes (default: 3MB)
  fileName?: string;
  onUploadSuccess?: (file: FileDataProps) => void;
  onUploadError?: (error: Error) => void;
  onRemoveSuccess?: (publicId: string) => void;
  onRemoveError?: (error: Error) => void;
  onFileSizeError?: (
    fileName: string,
    fileSize: number,
    maxSize: number
  ) => void;
}

export const useFileUpload = ({
  initialFiles = [],
  acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/msword": [".doc"],
    "application/vnd.ms-excel": [".xls", ".xlsx"],
    "image/jpeg": [".jpeg", ".jpg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
  },
  multiple = false,
  maxFileSize = 3 * 1024 * 1024, // 3MB default
  fileName,
  onUploadSuccess,
  onUploadError,
  onRemoveSuccess,
  onRemoveError,
  onFileSizeError,
}: UseFileUploadOptions = {}) => {
  const [files, setFiles] = useState<FileDataProps[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [operationId, setOperationId] = useState("");
  const [fileProgress, setFileProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const { mutateAsync: deleteFile, isSuccess } = useDeleteFile();
  const { mutateAsync: createFile } = useCreateFile();
  const { mutateAsync: createMultipleFiles } = useCreateMultipleFiles();

  const handleUpload = useCallback(
    async (fileToUpload: File) => {
      if (fileToUpload.size > maxFileSize) {
        const errorMsg = `File "${fileToUpload.name}" exceeds ${(
          maxFileSize /
          1024 /
          1024
        ).toFixed(1)}MB limit`;
        onFileSizeError?.(fileToUpload.name, fileToUpload.size, maxFileSize);
        onUploadError?.(new Error(errorMsg));
        return;
      }
      setUploading(true);
      const tempPublicId = Math.random().toString(36).slice(2);

      // Add placeholder
      setFiles((prev) => [
        ...prev,
        {
          url: "",
          publicId: tempPublicId,
          bytes: fileToUpload.size,
          extension: fileToUpload.name.split(".").pop() || "",
          fileType: fileToUpload.type,
          title: fileToUpload.name,
          uploading: true,
        },
      ]);
      setFileProgress((prev) => ({ ...prev, [tempPublicId]: 0 }));

      try {
        const response = await createFile({
          file: fileToUpload,
          fileName,
        });
        const { url, publicId, bytes, extension, fileType, title } =
          response?.data;
        const uploadedFile = {
          url,
          publicId,
          bytes,
          extension,
          fileType,
          title,
        };

        setFiles((prev) =>
          prev.map((f) => (f.publicId === tempPublicId ? uploadedFile : f))
        );

        setFileProgress((prev) => {
          const updated = { ...prev };
          delete updated[tempPublicId];
          updated[publicId] = 100;
          return updated;
        });

        onUploadSuccess?.(uploadedFile);
      } catch (err) {
        console.error("Upload failed:", err);
        setFiles((prev) => prev.filter((f) => f.publicId !== tempPublicId));
        setFileProgress((prev) => {
          const updated = { ...prev };
          delete updated[tempPublicId];
          return updated;
        });
        onUploadError?.(
          err instanceof Error ? err : new Error("Upload failed")
        );
      } finally {
        setUploading(false);
      }
    },
    [maxFileSize, fileName, onUploadSuccess, onUploadError, onFileSizeError]
  );

  const handleRemove = useCallback(
    async (publicId: string) => {
      setRemoving(true);
      setOperationId(publicId);

      try {
        const res = await deleteFile({publicId});
        const data = res.data

        if (isSuccess) {
          setFiles((prev) => prev.filter((f) => f.publicId !== publicId));
          onRemoveSuccess?.(publicId);
        }
      } catch (err) {
        console.error("Remove error:", err);
        onRemoveError?.(
          err instanceof Error ? err : new Error("Remove failed")
        );
      } finally {
        setRemoving(false);
        setOperationId("");
      }
    },
    [onRemoveSuccess, onRemoveError]
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) {
        if (multiple) {
          accepted.forEach(handleUpload);
        } else {
          handleUpload(accepted[0]);
        }
      }
    },
    [handleUpload, multiple]
  );

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
    isDragActive,
  } = useDropzone({
    onDrop,
    noClick: true,
    multiple,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
  });

  const resetFiles = useCallback(() => {
    setFiles(initialFiles);
    setFileProgress({});
  }, [initialFiles]);

  return {
    // State
    files,
    uploading,
    removing,
    operationId,
    fileProgress,
    isDragActive,

    // Actions
    handleUpload,
    handleRemove,
    setFiles,
    resetFiles,

    // Dropzone props
    getRootProps,
    getInputProps,
    openFileDialog,
  };
};
