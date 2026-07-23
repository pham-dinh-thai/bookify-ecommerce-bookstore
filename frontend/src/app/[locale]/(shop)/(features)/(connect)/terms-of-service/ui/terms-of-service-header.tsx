import { getTranslations } from 'next-intl/server';

type TermsOfServiceHeaderProps = {};

export default async function TermsOfServiceHeader({}: TermsOfServiceHeaderProps) {
  const t = await getTranslations('static.termsOfService');

  return (
    <header className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <span className="font-label uppercase tracking-widest text-[#3f6754] text-sm font-semibold mb-4 block">
        {t('label')}
      </span>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#2b352f] mb-6">
        {t('title')}
      </h1>
      <p className="text-lg text-[#58615b] max-w-2xl leading-relaxed text-justify">
        {t('description')}
      </p>
    </header>
  );
}
