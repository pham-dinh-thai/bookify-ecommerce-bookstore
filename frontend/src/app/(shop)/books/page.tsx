import CollectionPage from '../components/collection-page/collection-page';

type BooksPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() || '';
  const hasSearchQuery = searchQuery.length > 0;

  return (
    <CollectionPage
      type="genre"
      heading={hasSearchQuery ? `Results for "${searchQuery}"` : 'All Books'}
      description={
        hasSearchQuery
          ? 'Browse the matching titles from our catalog.'
          : 'Discover every title in our catalog, from timeless classics to modern reads curated for every kind of reader.'
      }
      searchQuery={searchQuery}
    />
  );
}
