"use client"
import { PageSpinner } from "@/components/ui/spinner";
import { usePathname } from "next/navigation";

const LoadingScreen = ({className}: {className?: string, color?: string}) => {
  const pathname = usePathname();
  const isVerification = pathname.includes("payment-verification")
  return (
    <div
      className={`flex justify-center items-center ${isVerification ? "py-25" : "min-h-screen"} ${className}`}
    >
      <PageSpinner />
    </div>
  );
};

export default LoadingScreen;
