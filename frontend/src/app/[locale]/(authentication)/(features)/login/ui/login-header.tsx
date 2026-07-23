type LoginHeaderProps = {};

export default function LoginHeader({}: LoginHeaderProps) {
  return (
    <header>
      <h1 className="text-[22px] font-bold text-[#1a3d2b] mb-1.5 text-center">
        Welcome back
      </h1>
      <p className="text-[13px] text-[#58615b] mb-7 text-center">
        Please log in to your account
      </p>
    </header>
  );
}
