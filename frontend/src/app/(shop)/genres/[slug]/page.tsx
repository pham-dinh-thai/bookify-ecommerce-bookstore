import CollectionPage from '../../components/collection-page/collection-page';

export default async function GenrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const heading = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CollectionPage
      type="genre"
      heading={heading}
      description="Explore curated titles in this genre, selected for readers who appreciate depth, style, and standout storytelling."
      genreSlug={slug}
    />
  );
}
