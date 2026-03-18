import React from "react";

const Spinner = ({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) => {
  const spinnerStyle = color
    ? ({ "--spinner-color": color } as React.CSSProperties)
    : {};
  return (
    <div className={`custom-loader ${className}`} style={spinnerStyle}></div>
  );
};

export default Spinner;
