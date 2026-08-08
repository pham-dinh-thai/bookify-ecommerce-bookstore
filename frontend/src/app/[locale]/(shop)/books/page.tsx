import { getTranslations } from 'next-intl/server';
import CollectionPage from '../components/collection-page/collection-page';

type BooksPageProps = {
  searchParams?: Promise<{ q?: string; page?: string }>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() || '';
  const hasSearchQuery = searchQuery.length > 0;
  const page = Math.max(1, parseInt(params?.page || '1', 10) || 1);
  const t = await getTranslations('books');

  return (
    <CollectionPage
      type="genre"
      heading={hasSearchQuery ? `Results for "${searchQuery}"` : t('title')}
      description={
        hasSearchQuery
          ? 'Browse the matching titles from our catalog.'
          : 'Discover every title in our catalog, from timeless classics to modern reads curated for every kind of reader.'
      }
      searchQuery={searchQuery}
      page={page}
    />
  );
}
