type FooterDescriptionProps = {
  appName: string;
  description: string;
};

export default function FooterDescription({
  appName,
  description,
}: FooterDescriptionProps) {
  return (
    <div>
      <p className="text-[15px] font-bold text-[#1B4332] mb-3">{appName}</p>
      <p className="text-[13px] text-[#4a7c60] leading-relaxed max-w-[280px] md:max-w-[280px]">
        {description}
      </p>
    </div>
  );
}
