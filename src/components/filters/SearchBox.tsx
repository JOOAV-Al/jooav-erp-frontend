import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search",
  value,
  onChange,
  className = "",
  inputClassName = "",
}) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex justify-center items-center p-3">
        <Search strokeWidth={2} className=" w-5 h-5 text-outline-passive" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className={`pl-9 pr-4 py-4 border border-border-main table-selected rounded-lg text-sm focus:outline-none w-62.5 h-[34px] placeholder:text-body-passive placeholder:text-sm ${inputClassName}`}
      />
    </div>
  );
};

export default SearchBox;
