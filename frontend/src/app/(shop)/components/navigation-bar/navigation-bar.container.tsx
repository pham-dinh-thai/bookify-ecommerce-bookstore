import NavigationBarPresenter from './navigation-bar.presenter';

export default function NavigationBarContainer() {
  const navLinks = [
    { label: 'Best Seller', path: '/best-seller' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'On Sales', path: '/on-sales' },
    {
      label: 'Category',
      children: [
        { label: 'By Author', path: '/authors' },
        { label: 'By Publisher', path: '/publishers' },
        { label: 'By Genre', path: '/genres' },
        { label: 'By Language', path: '/languages' },
      ],
    },
  ];

  return <NavigationBarPresenter navLinks={navLinks} appName="Bookify" />;
}
