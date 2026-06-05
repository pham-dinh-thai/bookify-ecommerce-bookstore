'use client';

import NavigationBarPresenter from './navigation-bar.presenter';
import { useEffect, useState } from 'react';
import { allGenreService } from '@/app/admin/genres/(genre-management)/services/all-genre.service';

const NAVBAR_GENRE_LIMIT = 12;

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NavigationBarContainer() {
  const [genres, setGenres] = useState<GenreLink[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await allGenreService(1, NAVBAR_GENRE_LIMIT, '');
        const genreLinks = (response?.genres || []).map(
          (genre: { name: string }) => ({
            label: genre.name,
            path: `/genres/${encodeURIComponent(createSlug(genre.name))}`,
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
