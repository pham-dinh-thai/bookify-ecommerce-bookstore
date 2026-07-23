import { getTranslations } from 'next-intl/server';

type ContactUsHeaderProps = {};

export default async function ContactUsHeader({}: ContactUsHeaderProps) {
  const t = await getTranslations('static.contactUs');

  return (
    <header className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
      <span className="font-label text-xs uppercase tracking-widest text-[#3f6754] mb-4 block font-bold">
        {t('label')}
      </span>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#2b352f] mb-8 leading-tight">
        {t('heading')}
      </h1>
      <p className="text-lg text-[#58615b] max-w-2xl mx-auto leading-relaxed">
        {t('description')}
      </p>
    </header>
  );
}
