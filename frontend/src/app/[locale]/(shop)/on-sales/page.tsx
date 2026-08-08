import CollectionPage from '../components/collection-page/collection-page';

export default async function OnSalesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, parseInt(query?.page || '1', 10) || 1);

  return (
    <CollectionPage
      type="on-sales"
      heading="On Sales"
      description="Browse discounted books and limited-time offers across many genres, carefully selected for smart collectors."
      page={page}
    />
  );
}
