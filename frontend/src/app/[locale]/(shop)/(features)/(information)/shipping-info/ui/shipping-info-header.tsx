import { getTranslations } from 'next-intl/server';

type ShippingInfoHeaderProps = {};

export default async function ShippingInfoHeader({}: ShippingInfoHeaderProps) {
  const t = await getTranslations('static.shippingInfo');

  return (
    <div className="mb-16">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
        {t('label')}
      </p>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        {t('title')}
      </h1>
      <p className="text-base text-gray-600 max-w-lg leading-relaxed">
        {t('description')}
      </p>
    </div>
  );
}
