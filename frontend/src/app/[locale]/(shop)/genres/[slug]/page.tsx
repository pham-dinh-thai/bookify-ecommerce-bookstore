import CollectionPage from '../../components/collection-page/collection-page';

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, parseInt(query?.page || '1', 10) || 1);
  const heading = slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CollectionPage
      type="genre"
      heading={heading}
      description="Explore curated titles in this genre, selected for readers who appreciate depth, style, and standout storytelling."
      genreSlug={slug}
      page={page}
    />
  );
}
