'use client';

import { useTranslations } from 'next-intl';
import FooterPresenter from './footer.presenter';

export default function FooterContainer() {
  const t = useTranslations('footer');

  const infoLinks = [
    { label: t('privacyPolicy'), path: '/privacy-policy' },
    { label: t('shippingInfo'), path: '/shipping-info' },
  ];

  const connectLinks = [
    { label: t('termsOfService'), path: '/terms-of-service' },
    { label: t('contactUs'), path: '/contact-us' },
  ];

  return (
    <FooterPresenter
      appName="Bookify"
      description={t('description')}
      information={t('information')}
      infoLinks={infoLinks}
      connect={t('connect')}
      connectLinks={connectLinks}
      copyright={t('copyright')}
    />
  );
}
