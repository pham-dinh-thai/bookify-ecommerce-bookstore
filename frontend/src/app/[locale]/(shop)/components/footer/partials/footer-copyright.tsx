type FooterCopyrightProps = {
  copyright: string;
};

export default function FooterCopyright({ copyright }: FooterCopyrightProps) {
  return (
    <div className="border-t border-[#2b5c42]/10 pt-6">
      <p className="text-[12px] text-[#4a7c60]">{copyright}</p>
    </div>
  );
}
