import Link from 'next/link';

export default function CreateBookAction({
  setFormData,
  setErrors,
  isLoading,
}: any) {
  const handleCancel = () => {
    setFormData({
      isbn: '',
      title: '',
      description: '',
      originalPrice: 0,
      quantity: 0,
      authorIds: [],
      publisherId: '',
      genreIds: [],
      languageId: '',
      pageCount: 0,
      coverUrl: '',
    });
    setErrors({});
  };

  return (
    <div
      className="md:col-span-2 pt-10 flex items-center justify-between"
      style={{ borderTop: '1px solid rgba(170,180,173,0.15)' }}
    >
      <Link
        href="/staff/books"
        className="px-8 py-4 font-bold uppercase text-[13px] flex items-center gap-2"
        style={{ color: '#58615b' }}
      >
        Go Back
      </Link>

      <div className="flex items-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-12 py-5 rounded-full font-bold uppercase text-[13px] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          style={{
            letterSpacing: '0.1em',
            backgroundColor: '#2C5282',
            color: '#e6ffef',
            boxShadow: '0 20px 40px rgba(63,103,84,0.2)',
          }}
        >
          RESET
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-12 py-5 rounded-full font-bold uppercase text-[13px] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          style={{
            letterSpacing: '0.1em',
            backgroundColor: '#3f6754',
            color: '#e6ffef',
            boxShadow: '0 20px 40px rgba(63,103,84,0.2)',
          }}
        >
          {isLoading ? 'Creating...' : 'Save New Book'}
        </button>
      </div>
    </div>
  );
}
