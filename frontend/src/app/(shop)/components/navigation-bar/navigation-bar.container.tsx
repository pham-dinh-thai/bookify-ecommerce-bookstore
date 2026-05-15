'use client';

import NavigationBarPresenter from './navigation-bar.presenter';
import { useEffect, useState } from 'react';
import { allGenreService } from '@/app/admin/genres/(genre-management)/services/all-genre.service';

export default function NavigationBarContainer() {
  const [genres, setGenres] = useState<GenreLink[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await allGenreService(1, 1000, '');
        const genreLinks = (response?.genres || []).map(
          (genre: { name: string }) => ({
            label: genre.name,
            path: `/genres/${genre.name.toLowerCase().replace(/\s+/g, '-')}`,
          }),
        );

        setGenres(genreLinks);
      } catch (error) {
        console.error('Failed to fetch genres for navbar:', error);
      }
    };

    fetchGenres();
  }, []);

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
