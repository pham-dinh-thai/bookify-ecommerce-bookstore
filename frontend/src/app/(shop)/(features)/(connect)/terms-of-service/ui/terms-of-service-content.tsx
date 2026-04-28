type TermsOfServiceItem = {
  title: string;
  content: string;
};

type TermsOfServiceContentProps = {
  section: TermsOfServiceItem[];
};

export default function TermsOfServiceContent({
  section,
}: TermsOfServiceContentProps) {
  return (
    <main className="pb-24 px-6 max-w-4xl mx-auto">
      <div className="space-y-24">
        {section &&
          section.map((item, idx) => (
            <section
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              <div className="md:col-span-4">
                <h2 className="text-2xl font-bold text-[#3f6754] tracking-tight">
                  {String(idx + 1).padStart(2, '0')}.{' '}
                  {item.title.split('. ')[1] || item.title}
                </h2>
              </div>
              <div className="md:col-span-8 space-y-6">
                <p className="text-[#58615b] leading-relaxed text-justify">
                  {item.content}
                </p>
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}
