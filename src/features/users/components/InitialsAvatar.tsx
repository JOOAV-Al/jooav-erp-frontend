
const InitialsAvatar = ({ name, className }: { name: string, className?: string }) => {
  const parts = name?.trim().split(" ") ?? [];
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : (parts[0]?.[0] ?? "?");
  return (
    <div className={`w-[26px] h-[26px] flex-shrink-0 flex justify-center items-center rounded-full bg-tag-added border border-border-main text-[13px] font-semibold tracking-[0.05em] text-brand-primary uppercase ${className}`}>
      {initials}
    </div>
  );
};

export default InitialsAvatar