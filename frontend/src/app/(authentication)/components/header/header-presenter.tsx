import Image from 'next/image';
import Link from 'next/link';

type AuthHeaderPresenterProps = {
  appName: string;
};

export default function AuthHeaderPresenter({
  appName,
}: AuthHeaderPresenterProps) {
  return (
    <header className="flex items-center justify-between px-8 py-5">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm font-bold tracking-tight shrink-0 text-[#2d6a4f]"
      >
        <Image src="/bookify.png" alt="Logo" width={32} height={32} /> {appName}
      </Link>
    </header>
  );
}
