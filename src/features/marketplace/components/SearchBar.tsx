"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  navigateOnSearch?: boolean;
}

export default function SearchBar({
  placeholder = "Search product names",
  onSearch,
  className = "",
  navigateOnSearch = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    if (navigateOnSearch && query.trim()) {
      router.push(
        `/dashboard/marketplace?q=${encodeURIComponent(query.trim())}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      {/* Left icon — same position as auth Input leftIcon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <div className="p-2 h-6 w-6 flex items-center justify-center">
          <Search className="h-5 w-5 text-outline-passive" strokeWidth={2} />
        </div>
      </div>

      {/* Input — same styling as auth Input, only border-radius changes to rounded-full */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          // Matches auth Input base
          "w-full min-w-0 h-[48px] bg-storey-foreground border-[1.5px] border-border-main",
          "py-md outline-none leading-normal tracking-[0.04em] text-body font-medium text-sm",
          "placeholder:text-card-body placeholder:text-body-passive",
          // Icon padding
          "pl-11 pr-main",
          // Auth Input shadow - shadow-input
          "focus-visible:shadow-input",
          "transition-[color,box-shadow] focus-visible:bg-background",
          // Only difference: full pill radius (vs rounded-md on auth inputs)
          "rounded-3xl",
        )}
      />
    </form>
  );
}
