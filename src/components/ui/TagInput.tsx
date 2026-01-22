import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    { value = [], onChange, placeholder, className, leftIcon, disabled },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag();
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        value.length > 0
      ) {
        // Remove last tag when backspace is pressed on empty input
        removeTag(value.length - 1);
      }
    };

    const addTag = () => {
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !value.includes(trimmedValue)) {
        onChange([...value, trimmedValue]);
        setInputValue("");
      }
    };

    const removeTag = (indexToRemove: number) => {
      onChange(value.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Check if user typed a comma
      if (newValue.includes(",")) {
        const parts = newValue.split(",");
        const newTag = parts[0].trim();
        if (newTag && !value.includes(newTag)) {
          onChange([...value, newTag]);
        }
        setInputValue("");
      } else {
        setInputValue(newValue);
      }
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div
        ref={ref}
        onClick={handleContainerClick}
        className={cn(
          "w-full min-w-0 min-h-12 rounded-lg bg-white border border-transparent",
          "py-md text-base outline-none leading-20",
          "shadow-input focus-within:shadow-input",
          "transition-[color,box-shadow]",
          "cursor-text",
          "flex items-center flex-wrap gap-2",
          leftIcon ? "pl-15 pr-4" : "px-4",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 px-main py-md rounded-l-lg flex items-center justify-center pointer-events-none bg-storey-foreground border-r-2 border-border-main max-w-12">
            <div className="p-3 flex items-center justify-center">
              {leftIcon}
            </div>
          </div>
        )}

        {/* Tags */}
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-foreground rounded-md text-sm"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:bg-gray-200 rounded p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-outline-passive" />
              </button>
            )}
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className={cn(
            "flex-1 min-w-[120px] bg-transparent outline-none",
            "placeholder:text-body-passive",
            disabled && "cursor-not-allowed",
          )}
        />
      </div>
    );
  },
);

TagInput.displayName = "TagInput";
