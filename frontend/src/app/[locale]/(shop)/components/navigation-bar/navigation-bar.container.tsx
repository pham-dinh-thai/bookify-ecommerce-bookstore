'use client';

import NavigationBarPresenter from './navigation-bar.presenter';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { allGenreService } from '@/app/admin/genres/(genre-management)/services/all-genre.service';

const NAVBAR_GENRE_LIMIT = 12;

type ApiTopGenre = {
  genreId: string;
  genreName: string;
  unitsSold: number;
};

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
  const t = useTranslations('nav');

  useEffect(() => {
    const toGenreLink = (genre: { id?: string; name: string }) => ({
      label: genre.name,
      path: `/genres/${encodeURIComponent(createSlug(genre.name))}`,
    });

    const fetchFallbackGenres = async () => {
      const response = await allGenreService(1, NAVBAR_GENRE_LIMIT, '');

      return (response?.genres || []).map((genre: { name: string }) =>
        toGenreLink(genre),
      );
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/shop-navigation', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const topGenres: ApiTopGenre[] = Array.isArray(data?.topGenres)
            ? data.topGenres
            : [];
          const popularGenreLinks = topGenres
            .filter((genre) => Boolean(genre.genreName))
            .sort((a, b) => Number(b.unitsSold) - Number(a.unitsSold))
            .slice(0, NAVBAR_GENRE_LIMIT)
            .map((genre) =>
              toGenreLink({ id: genre.genreId, name: genre.genreName }),
            );

          if (popularGenreLinks.length > 0) {
            setGenres(popularGenreLinks);
            return;
          }
        }

        const genreLinks = await fetchFallbackGenres();

        setGenres(genreLinks);
      } catch (error) {
        console.error('Failed to fetch genres for navbar:', error);

        try {
          const genreLinks = await fetchFallbackGenres();
          setGenres(genreLinks);
        } catch (fallbackError) {
          console.error(
            'Failed to fetch fallback genres for navbar:',
            fallbackError,
          );
        }
      }
    };

    fetchGenres();
  }, []);

  const navLinks = [
    { label: t('bestSeller'), path: '/best-seller' },
    { label: t('newArrivals'), path: '/new-arrivals' },
    { label: t('onSales'), path: '/on-sales' },
  ];

  return (
    <NavigationBarPresenter
      navLinks={navLinks}
      genres={genres}
      appName="Bookify"
    />
  );
}
