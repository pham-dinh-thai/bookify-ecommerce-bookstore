import Image from 'next/image';
import Link from 'next/link';

export default function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 px-2 mb-7">
      <Link href="/">
        <span className="flex items-center gap-1 text-sm font-bold tracking-tight shrink-0 text-[#2d6a4f]">
          <Image src="/bookify.png" alt="Logo" width={36} height={36} />{' '}
        </span>
      </Link>

      <div>
        <p className="text-[16px] font-bold text-[#1a3d2b] leading-tight">
          Staff Dashboard
        </p>
        <p className="text-[9px] font-semibold tracking-[0.08em] uppercase text-[#aab4ad]">
          Bookify
        </p>
      </div>
    </div>
  );
}
