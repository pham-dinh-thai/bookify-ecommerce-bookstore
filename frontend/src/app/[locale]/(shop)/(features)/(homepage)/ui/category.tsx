import {
  ArrowRight,
  BookOpen,
  LibraryBig,
  PenLine,
  Sparkles,
} from 'lucide-react';
import img from '../assets/img7.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

type HomepageGenre = {
  id: string;
  name: string;
  slug: string;
};

type CategoryProps = {
  genres: HomepageGenre[];
};

const icons = [LibraryBig, Sparkles, BookOpen, PenLine, ArrowRight];

export default async function Category({ genres }: CategoryProps) {
  if (genres.length === 0) return null;

  const t = await getTranslations('home');
  const [featuredGenre, ...secondaryGenres] = genres;

  return (
    <section className="bg-[#2d6a4f] py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-6 lg:px-24">
        <div className="mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#f7faf5] tracking-tight mb-4">
            {featuredGenre.name.toUpperCase()}
          </h2>
          <p className="text-[#f7faf5]">
            {t('exploreGenre')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Link
            href={`/genres/${encodeURIComponent(featuredGenre.slug)}`}
            className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm group cursor-pointer overflow-hidden relative min-h-[300px] md:min-h-[400px] md:col-span-2 md:row-span-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-[1]" />

            <div className="relative z-10">
              <span className="text-xs font-bold tracking-widest uppercase text-[#2d6a4f] mb-2 block">
                {t('featured')}
              </span>
              <h3 className="text-3xl font-bold mb-4 text-[#1a3d2b]">
                {featuredGenre.name}
              </h3>
              <p className="text-[#58615b] max-w-xs">
                {t('openCollection', { genre: featuredGenre.name })}
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-3/4 transform translate-y-8 translate-x-8 transition-transform">
              <Image
                src={img}
                className="rounded-tl-3xl shadow-2xl"
                alt={featuredGenre.name}
              />
            </div>
          </Link>

          {secondaryGenres.map((genre, index) => {
            const Icon = icons[index + 1] || BookOpen;
            const isWide = index === 2;

            return (
              <Link
                key={genre.id}
                href={`/genres/${encodeURIComponent(genre.slug)}`}
                className={`${
                  isWide
                    ? 'md:col-span-2 bg-[#d4e3ff] text-[#2d5383]'
                    : 'bg-[#dbe5dd] text-[#1a3d2b]'
                } p-6 md:p-8 rounded-[2rem] group cursor-pointer relative overflow-hidden transition-transform hover:-translate-y-1`}
              >
                <div className="flex h-full min-h-[168px] justify-between gap-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{genre.name}</h3>
                    <p
                      className={`text-sm max-w-xs ${
                        isWide ? 'text-[#2d5383]/80' : 'text-[#58615b]'
                      }`}
                    >
                      {t('viewAllGenre', { genre: genre.name })}
                    </p>
                  </div>
                  <Icon
                    size={36}
                    className={isWide ? 'shrink-0' : 'shrink-0 text-[#2d6a4f]'}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
