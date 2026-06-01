import { RefreshCw } from 'lucide-react';

type RefreshButtonProps = {
  onRefresh: () => void | Promise<void>;
  loading?: boolean;
  label?: string;
  variant?: 'primary' | 'icon';
};

export default function RefreshButton({
  onRefresh,
  loading = false,
  label = 'Refresh',
  variant = 'primary',
}: RefreshButtonProps) {
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877] transition-colors hover:bg-[#dbe9ff] disabled:cursor-not-allowed disabled:opacity-60"
        title={label}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={loading}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2d6a4f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#166244] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      {label}
    </button>
  );
}
