import React from "react";

const BreadCrumbs = ({ routes }: { routes: string[] }) => {
  return (
    <div className="flex gap-[4px] px-2 py-md  items-center">
      {routes.map((route, index) => {
        const isFirst = index === 0;
        const isLast = index === routes.length - 1;
        return (
          <p key={index} className="flex gap-[4px] leading-[1.2] tracking-[0.04em] text-[15px] font-medium">
            <span
              className={`${isFirst ? "text-body-passive" : "text-body"}`}
              key={index}
            >
              {route}
            </span>
            {!isLast && <span className="text-body">/</span>}
          </p>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
