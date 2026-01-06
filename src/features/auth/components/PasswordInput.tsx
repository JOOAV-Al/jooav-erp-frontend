import React, { useState } from "react";
import { EyeClosedIcon, EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  field: any;
  placeholder?: string;
  className?: string;
  ariaInvalid?: boolean;
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

  const leftIcon = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors flex items-center justify-center"
      tabIndex={-1}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeIcon className="h-4 w-4" />
      ) : (
        <EyeClosedIcon className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <Input
      placeholder={placeholder || "Enter Password"}
      type={showPassword ? "text" : "password"}
      {...field}
      value={field.value || ""}
      aria-invalid={ariaInvalid}
      leftIcon={leftIcon}
      className={className}
    />
  );
}