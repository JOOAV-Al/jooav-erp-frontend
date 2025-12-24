import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { Input } from "../ui/input";

interface PasswordInputProps {
  field: any;
  placeholder?: string;
  className?: string;
  ariaInvalid?: boolean
}

export default function PasswordInput({
  field,
  placeholder,
  className,
  ariaInvalid,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder ? placeholder : "Enter Password"}
        type={showPassword ? "text" : "password"}
        {...field}
        value={field.value || ""}
        aria-invalid={ariaInvalid}
        className={`${className}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 px-4 flex items-center flex-1 text-gray-600 cursor-pointer"
      >
        {showPassword ? (
          <EyeOffIcon className="h-[20px] w-[20px]" />
        ) : (
          <EyeIcon className="h-[20px] w-[20px]" />
        )}
      </button>
    </div>
  );
}
