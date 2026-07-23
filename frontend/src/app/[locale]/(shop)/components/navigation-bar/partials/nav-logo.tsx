import Image from 'next/image';
import Link from 'next/link';

type NavLogoProps = {
  appName: string;
};

export default function NavLogo({ appName }: NavLogoProps) {
  return (
    <Link href="/">
      <span className="flex items-center gap-1 text-sm font-bold tracking-tight shrink-0 text-[#2d6a4f]">
        <Image src="/bookify.png" alt="Logo" width={32} height={32} /> {appName}
      </span>
    </Link>
  );
}
