import { useRef, useState } from "react";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export const useFileObjectUpload = (multiple: boolean = false) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const mappedFiles: UploadedFile[] = Array.from(selectedFiles).map(
      (file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
      })
    );

    setFiles((prev) => (multiple ? [...prev, ...mappedFiles] : mappedFiles));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const clearFiles = () => setFiles([]);

  return {
    files,
    inputRef,
    openFileDialog,
    handleFileChange,
    removeFile,
    clearFiles,
  };
};
