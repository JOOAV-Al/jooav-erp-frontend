"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadBoxProps {
  value?: File | string | null; // File (new) OR url (edit)
  onChange?: (file: File | null) => void;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
}

export function ImageUploadBox({
  value,
  onChange,
  width = 120,
  height = 120,
  className,
  imageClassName,
}: ImageUploadBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // Handle initial URL (edit mode)
  React.useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange?.(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative flex items-center justify-center rounded-2xl",
        "cursor-pointer bg-storey-foreground hover:bg-muted/60 transition",
        className,
      )}
      style={{ width, height }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleSelect}
      />

      {preview ? (
        <div className={`${imageClassName}`}>
          <Image
            src={preview}
            alt="Preview"
            // fill
            width={width}
            height={height}
            className="object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute cursor-pointer top-2 right-2 z-10 bg-white rounded-full p-4 shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-2">
          <Plus className="w-[17px] h-[17px] text-outline-passive" />
        </div>
      )}
    </div>
  );
}
