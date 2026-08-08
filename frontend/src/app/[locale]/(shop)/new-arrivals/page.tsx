import CollectionPage from '../components/collection-page/collection-page';

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, parseInt(query?.page || '1', 10) || 1);

  return (
    <CollectionPage
      type="new-arrivals"
      heading="New Arrivals"
      description="Discover the latest books recently added to our gallery, from contemporary voices to timeless new editions."
      page={page}
    />
  );
}
