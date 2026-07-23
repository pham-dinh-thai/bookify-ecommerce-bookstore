type FooterInformationProps = {
  information: string;
  infoLinks: InfoLink[];
};

import Link from 'next/link';

export default function FooterInformation({
  information,
  infoLinks,
}: FooterInformationProps) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#4a7c60] mb-4">
        {information}
      </p>
      <ul className="flex flex-col gap-3.5">
        {infoLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.path}
              className="text-[13px] text-[#2b5c42] hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
