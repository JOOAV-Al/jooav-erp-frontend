"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface AppImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function AppImage({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  ...props
}: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc || fallbackSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
