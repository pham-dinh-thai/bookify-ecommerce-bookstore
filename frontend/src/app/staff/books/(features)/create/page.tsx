import BookFormNavigate from '../../components/book-form-navigate';
import CreateBookForm from './ui/create-book-form';
import CreateBookHeader from './ui/create-book-header';

export default function CreateBook() {
  return (
    <div className="px-12 py-8">
      <div className="max-w-3xl mx-auto">
        <BookFormNavigate label="Create Book" />

        <div
          className="rounded-[2rem] p-10 lg:p-16"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0px 40px 80px rgba(43,53,47,0.06)',
          }}
        >
          <CreateBookHeader />

          <CreateBookForm />
        </div>
      </div>
    </div>
  );
}
