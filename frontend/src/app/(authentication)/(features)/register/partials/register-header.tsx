type RegisterHeaderProps = {
  title: string;
  description: string;
};

export default function RegisterHeader({
  title,
  description,
}: RegisterHeaderProps) {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-[#1a3d2b] mb-1.5 text-center">
        {title}
      </h1>
      <p className="text-[13px] text-[#58615b] mb-7 text-center">
        {description}
      </p>
    </div>
  );
}
