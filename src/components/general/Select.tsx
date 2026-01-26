import * as React from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBox from "@/components/filters/SearchBox";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  searchable?: boolean;
  className?: string;
  marginBottom?: string;
  disableAutoMargin?: boolean;

}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select option",
      leftIcon,
      searchable = false,
      className,
      marginBottom="mb-62",
      disableAutoMargin= false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    const dropdownRef = React.useRef<HTMLDivElement | null>(null);
    const [measuredMargin, setMeasuredMargin] = React.useState<
      number | null
    >(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [options, searchQuery]);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    // measure dropdown height when open, options change or window resizes
    React.useEffect(() => {
      if (!isOpen) {
        setMeasuredMargin(null);
        return;
      }

      const measure = () => {
        const height = dropdownRef.current?.offsetHeight ?? 0;
        const gap = 12; // extra space so it doesn't touch
        setMeasuredMargin(height + gap);
      };

      // measure after next paint (dropdown just mounted)
      requestAnimationFrame(measure);

      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, [isOpen, filteredOptions]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasLeftIcon = Boolean(leftIcon);

    return (
      <div
        ref={containerRef}
        style={
          !disableAutoMargin && measuredMargin
            ? { marginBottom: `${measuredMargin}px` }
            : undefined
        }
        className={`relative w-full ${isOpen && disableAutoMargin ? marginBottom : ""}`}
      >
        {/* Select Trigger */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            // Base styles
            "w-full min-w-0 h-12 rounded-md bg-white border border-transparent",
            "py-md text-base outline-none leading-20",
            "shadow-input focus-within:shadow-input",
            "transition-[color,box-shadow]",
            "cursor-pointer",
            "flex items-center justify-between",

            // Padding based on icons
            hasLeftIcon ? "pl-11 pr-11" : "px-main pr-11",

            className,
          )}
        >
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <div className="p-3 flex items-center justify-center">
                {leftIcon}
              </div>
            </div>
          )}

          {/* Selected value or placeholder */}
          <span
            className={cn(
              "truncate flex-1",
              selectedOption ? "text-foreground" : "text-body-passive",
            )}
          >
            {selectedOption?.label || placeholder}
          </span>

          {/* Right Icon - Chevron */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="p-1 flex items-center justify-center">
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-outline-passive" />
              ) : (
                <ChevronDown className="h-5 w-5 text-outline-passive" />
              )}
            </div>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute p-md z-50 w-full mt-3 bg-white rounded-lg select-dropdown-shadow max-h-60 overflow-hidden"
          >
            {/* Search Input */}
            {searchable && (
              <SearchBox
                placeholder="Search choice"
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                inputClassName="max-w-full! h-10"
                className="mb-4"
                //  onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Options List */}
            <div className="overflow-y-auto flex flex-col max-h-64">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "p-sm cursor-pointer transition-colors text-outline] hover:bg-gray-100 text-[15px] ",
                      option.value === value && "bg-gray-100 text-outline",
                    )}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-outline] text-center text-[15px]">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
export type { SelectOption, SelectProps };
