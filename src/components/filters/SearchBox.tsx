import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search",
  value,
  onChange,
  className = "",
}) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`relative py-4 ${className}`}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-passive" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className="pl-7 pr-4 py-4 border border-border-main table-selected rounded-lg text-sm focus:outline-none max-w-42.5 w-full"
      />
    </div>
  );
};

export default SearchBox;
