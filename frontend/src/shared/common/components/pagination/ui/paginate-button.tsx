type PaginateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function PaginateButton({
  onClick,
  disabled,
  children,
  className = '',
}: PaginateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center h-8 md:h-10 min-w-[56px] md:min-w-[88px] rounded-full border border-[#d6ded4] bg-white px-2 md:px-4 text-[11px] md:text-sm font-semibold text-[#4f6553] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#f5fbf5] ${className}`}
    >
      {children}
    </button>
  );
}
