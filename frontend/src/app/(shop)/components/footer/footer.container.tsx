import FooterPresenter from './footer.presenter';

export default function FooterContainer() {
  const infoLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Shipping Info', path: '/shipping-info' },
  ];

  const connectLinks = [
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'Contact Us', path: '/contact-us' },
  ];

  return (
    <FooterPresenter
      appName="Bookify"
      description="Crafting a bridge between cultures through the timeless medium of printed pages. Visit our bookstore in Hoan Kiem, Hanoi, or browse our digital archives."
      information="Information"
      infoLinks={infoLinks}
      connect="Connect"
      connectLinks={connectLinks}
      copyright="Non-commercial website, only serves educational purposes"
    />
  );
}
