import Link from 'next/link';

type DontHaveAnAccountProps = {
  path: string;
};

export default function DontHaveAnAccount({ path }: DontHaveAnAccountProps) {
  return (
    <p className="text-center text-[13px] text-[#58615b] mt-4">
      Don't have an account?{' '}
      <Link href={path} className="text-[#2d6a4f] font-bold hover:opacity-70">
        Register now
      </Link>
    </p>
  );
}
