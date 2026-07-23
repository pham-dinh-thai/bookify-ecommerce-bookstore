import { getTranslations } from 'next-intl/server';

type PrivacyPolicyHeaderProps = {};

export default async function PrivacyPolicyHeader({}: PrivacyPolicyHeaderProps) {
  const t = await getTranslations('static.privacyPolicy');

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-12">
      <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
        {t('label')}
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {t('title')}
      </h1>
      <p className="text-sm text-gray-600">
        Last Updated: {formatDate(new Date())}
      </p>
    </div>
  );
}
