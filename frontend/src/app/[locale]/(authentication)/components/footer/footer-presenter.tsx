type Link = {
  label: string;
  path: string;
};

type AuthFooterPresenterProps = {
  links: Link[];
};

export default function AuthFooterPresenter({
  links,
}: AuthFooterPresenterProps) {
  return (
    <footer className="flex flex-col items-center gap-3 py-5">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.path}
            className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#aab4ad] hover:text-[#58615b] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
