import NavigationBarPresenter from './navigation-bar.presenter';

export default function NavigationBarContainer() {
  const genres = [
    { label: 'Fiction', path: '/genres/fiction' },
    { label: 'Fantasy', path: '/genres/fantasy' },
    { label: 'Romance', path: '/genres/romance' },
    { label: 'Mystery', path: '/genres/mystery' },
    { label: 'History', path: '/genres/history' },
  ];

  const navLinks = [
    { label: 'Best Seller', path: '/best-seller' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'On Sales', path: '/on-sales' },
  ];

  return (
    <NavigationBarPresenter
      navLinks={navLinks}
      genres={genres}
      appName="Bookify"
    />
  );
}
