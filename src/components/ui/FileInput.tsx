import * as React from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  onFileSelect?: (file: File | null) => void;
  onClear?: () => void;
  accept?: string;
  fileName?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileSelect, onClear, accept, fileName, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = React.useState<string | null>(
      fileName || null,
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file.name);
        onFileSelect?.(file);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onClear?.();
      onFileSelect?.(null);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    React.useEffect(() => {
      if (fileName) {
        setSelectedFile(fileName);
      }
    }, [fileName]);

    return (
      <div className="relative w-full">
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="sr-only"
          {...props}
        />

        {/* Custom file input display */}
        <div
          onClick={handleClick}
          className={cn(
            // Base styles
            "w-full min-w-0 h-[48px] rounded-lg bg-white border border-transparent",
            "py-md text-sm outline-none leading-20 tracking-[0.04em] text-body font-medium",
            "shadow-input focus-within:shadow-input",
            "transition-[color,box-shadow]",
            "cursor-pointer",
            "flex items-center",

            // Padding to accommodate icons
            "pl-15 pr-11",

            className,
          )}
        >
          {/* Left Icon - Upload */}
          <div className="absolute inset-y-0 left-0 px-main py-md rounded-l-lg flex items-center justify-center pointer-events-none bg-storey-foreground border-r-2 border-border-main max-w-12">
            <div className="p-3 flex items-center justify-center">
              <Upload
                strokeWidth={2}
                className="h-5 w-5 text-outline-passive"
              />
            </div>
          </div>

          {/* File name or placeholder */}
          <span
            className={cn(
              "truncate flex-1 text-sm",
              selectedFile ? "text-foreground" : "text-body-passive",
            )}
          >
            {selectedFile || "Select file"}
          </span>

          {/* Right Icon - Clear button */}
          {selectedFile && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-auto">
              <button
                type="button"
                onClick={handleClear}
                className="p-1 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
              >
                <X className="h-5 w-5 text-outline-passive hover:text-outline" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

FileInput.displayName = "FileInput";

export { FileInput };
