import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  className?: string;
  existingTags?: string[];
  onRemoveExisting?: (tag: string) => void;
}

const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value = [],
      onChange,
      placeholder = "Add tag",
      leftIcon,
      className,
      existingTags = [],
      onRemoveExisting,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [internalTags, setInternalTags] = React.useState<string[]>(value);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const hasLeftIcon = Boolean(leftIcon);

    // Sync internal state with external value
    React.useEffect(() => {
      setInternalTags(value);
    }, [value]);

    const addTag = (tag: string) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !internalTags.includes(trimmedTag)) {
        const newTags = [...internalTags, trimmedTag];
        setInternalTags(newTags);
        onChange?.(newTags);
        setInputValue("");
      }
    };

    const removeTag = (tagToRemove: string) => {
      const newTags = internalTags.filter((tag) => tag !== tagToRemove);
      setInternalTags(newTags);
      onChange?.(newTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (inputValue.trim()) {
          addTag(inputValue);
        }
      } else if (
        e.key === "Backspace" &&
        !inputValue &&
        internalTags.length > 0
      ) {
        // Remove last tag when backspacing with empty input
        removeTag(internalTags[internalTags.length - 1]);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div className="w-full space-y-3">
        {/* Input Field with New Tags */}
        <div className="relative w-full">
          {/* Left Icon - positioned absolutely relative to this container */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-3 flex items-center pointer-events-none z-10">
              <div className="p-3 flex items-center justify-center">
                {leftIcon}
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            onClick={handleContainerClick}
            className={cn(
              // Base styles
              "w-full min-h-12 rounded-md bg-white border border-transparent",
              "text-base outline-none",
              "shadow-input focus-within:shadow-input focus-visible:shadow-input",
              "transition-[color,box-shadow]",
              "cursor-text",
              "flex flex-wrap items-center gap-2",
              `${internalTags.length === 0 ? "py-2" : "py-md"}`,

              // Padding based on icon
              hasLeftIcon ? "pl-11 pr-main" : "px-main",

              // Focus state
              "focus-visible:bg-background",

              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",

              className,
            )}
          >
            {/* Tags inside input */}
            <div className="flex flex-wrap gap-x-4 gap-y-6">
              {internalTags.map((tag, index) => (
                <div
                  key={`tag-${index}`}
                  className="inline-flex items-center gap-6 px-4 py-5 bg-storey-foreground border border-border-main table-selected rounded-md"
                >
                  <p className="h-[9px] flex justify-center items-center">
                    <span className="text-body rounded-md text-[13px] font-semibold">
                      {tag}
                    </span>
                  </p>
                  {/* <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="flex items-center justify-center hover:bg-gray-300 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-outline-passive hover:text-outline" />
                </button> */}
                </div>
              ))}
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={internalTags.length === 0 ? placeholder : ""}
              className={cn(
                "flex-1 min-w-[120px] bg-transparent outline-none border-none",
                "placeholder:text-body-passive text-foreground",
                "py-1",
              )}
            />
          </div>
        </div>
        {/* Existing Tags (when editing) */}
        {existingTags.length > 0 && (
          <div className="flex flex-wrap gap-5">
            {existingTags.map((tag, index) => (
              <div
                key={`existing-${index}`}
                className="inline-flex items-center gap-5 px-sm py-5 bg-[#F6F9FE] border-[0.5px] border-[#97BDF5] table-selected rounded-main"
              >
                <p className="h-[17px] flex justify-center items-center">
                  <span className="text-body rounded-md text-[13px] font-semibold">
                    {tag}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => onRemoveExisting?.(tag)}
                  className="flex items-center justify-center cursor-pointer hover:bg-gray-300 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-outline-passive hover:text-outline" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

TagInput.displayName = "TagInput";

export { TagInput };
