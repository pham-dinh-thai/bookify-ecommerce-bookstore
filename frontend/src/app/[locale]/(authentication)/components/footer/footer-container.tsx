import AuthFooterPresenter from './footer-presenter';

type AuthFooterContainerProps = {};

export default function AuthFooterContainer({}: AuthFooterContainerProps) {
  const links = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms Of Service', path: '/terms-of-service' },
    { label: 'Contact Us', path: '/contact-us' },
  ];

  return <AuthFooterPresenter links={links} />;
}
