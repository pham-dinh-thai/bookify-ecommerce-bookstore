type PaginateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function PaginateButton({
  onClick,
  disabled,
  children,
}: PaginateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center h-10 min-w-[88px] rounded-full border border-[#d6ded4] bg-white px-4 text-sm font-semibold text-[#4f6553] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#f5fbf5]"
    >
      {children}
    </button>
  );
}
