import CustomLoader from "@/components/general/CustomLoader";
import React from "react";

const LoadingScreen = ({className}: {className?: string, color?: string}) => {
  return (
    <div className={`flex justify-center items-center min-h-screen ${className}`}>
      <CustomLoader />
    </div>
  );
};

export default LoadingScreen;
