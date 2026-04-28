import Link from 'next/link';

type LinkToLoginProps = {
  href: string;
};

export default function LinkToLogin({ href }: LinkToLoginProps) {
  return (
    <div>
      <p className="text-[12px] text-[#58615b] text-center">
        Already have an account{' '}
        <Link
          href={href}
          className="text-[#2d6a4f] font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
