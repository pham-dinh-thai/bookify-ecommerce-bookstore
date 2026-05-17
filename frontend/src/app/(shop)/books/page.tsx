import CollectionPage from '../components/collection-page/collection-page';

type BooksPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q || '';

  return (
    <CollectionPage
      type="genre"
      heading="All Books"
      description="Discover every title in our catalog, from timeless classics to modern reads curated for every kind of reader."
      searchQuery={searchQuery}
    />
  );
}
