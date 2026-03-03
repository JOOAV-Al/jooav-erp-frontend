import * as React from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBox from "@/components/filters/SearchBox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  disabled?: boolean;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void
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
      disabled,
      isOpen, 
      setIsOpen,
      // marginBottom = "mb-62",
      // disableAutoMargin = false,
    },
    ref,
  ) => {
    
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    const dropdownRef = React.useRef<HTMLDivElement | null>(null);
    const [measuredMargin, setMeasuredMargin] = React.useState<number | null>(
      null,
    );

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
        className={`relative w-full`}
        // style={
        //   !disableAutoMargin && measuredMargin
        //     ? { marginBottom: `${measuredMargin}px` }
        //     : undefined
        // }
        // className={`relative w-full ${isOpen && disableAutoMargin ? marginBottom : ""}`}
      >
        {/* Select Trigger */}
        <div
          onClick={() => {
            if(disabled) return
            setIsOpen(!isOpen)
          } 
        }
          className={cn(
            // Base styles
            `w-full min-w-0 h-[48px] rounded-md ${isOpen || disabled ? "bg-background" : "bg-white"} border border-transparent`,
            "py-md text-base outline-none",
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
              "truncate flex-1 font-medium leading-[1.5] tracking-[0.04em] text-sm",
              selectedOption ? "text-body" : "text-body-passive",
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
            className="absolute pt-md z-50 w-full mt-3 bg-white rounded-lg select-dropdown-shadow max-h-60 flex flex-col"
          >
            {/* Search Input */}
            {searchable && (
              <div className="sticky top-0 bg-white z-20 px-md">
                <SearchBox
                  placeholder="Search choice"
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                  inputClassName="max-w-full! w-full h-10"
                  // className="mb-4"
                  //  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options List */}
            {/* TODO: Implement a dynamic logic to calculate and adjust height of dropdown based on content */}
            <ScrollArea isSidebar className="h-30 overflow-y-auto">
              {/* <div className="overflow-y-auto flex-1 flex flex-col gap-5 pt-sm"> */}
              <div className="flex-1 flex flex-col gap-5 py-sm">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "mx-3 px-sm rounded-main h-6.5 cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
                          option.value === value &&
                            "bg-storey-foreground text-body table-selected",
                        )}
                      >
                        <span className="leading-[1.2] tracking-[0.04em] text-[15px] font-medium">
                          {option.label}
                        </span>
                      </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-body text-center text-[15px] mt-6">
                    <span>No options found</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
export type { SelectOption, SelectProps };
