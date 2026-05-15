import BookFormNavigate from '../../components/book-form-navigate';
import EditBookHeader from './ui/edit-book-header';
import EditBookForm from './ui/edit-book-form';

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-12">
      <BookFormNavigate label="Edit Book" />
      <EditBookHeader />
      <EditBookForm bookId={id} />
    </div>
  );
}
