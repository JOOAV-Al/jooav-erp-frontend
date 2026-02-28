import React from 'react'

const FormGroupName = ({name}: {name: string}) => {
  return (
    <div className="truncate text-clip flex items-center gap-3 text-body-passive text-xs font-mono tracking-[0.08em]">
      <span className="leading-[1.2]">{name}</span>
      <span>
        -------------------------------------------------------------------------------------------------
      </span>
    </div>
  );
}

export default FormGroupName