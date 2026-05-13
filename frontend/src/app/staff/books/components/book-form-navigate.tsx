import Link from 'next/link';

export default function BookFormNavigate({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-2 text-xs font-bold uppercase mb-4"
      style={{ letterSpacing: '0.3em', color: '#3f6754' }}
    >
      <Link href="/staff/books" className="hover:underline">
        Book Management
      </Link>
      <span style={{ color: '#8c9b8d' }}>›</span>
      <span style={{ color: '#8c9b8d' }}>{label}</span>
    </div>
  );
}
