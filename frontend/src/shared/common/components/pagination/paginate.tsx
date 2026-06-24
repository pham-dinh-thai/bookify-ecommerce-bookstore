import PaginateButton from './ui/paginate-button';

type PaginateProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  showTotal?: boolean;
};

export default function Paginate({
  page,
  pageSize,
  total,
  onPageChange,
  showTotal = true,
}: PaginateProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleFirst = () => {
    if (page > 1) onPageChange(1);
  };

  const handleLast = () => {
    if (page < totalPages) onPageChange(totalPages);
  };

  const getPageNumbers = () => {
    const delta = 3;
    let start = Math.max(1, page - delta);
    let end = Math.min(totalPages, page + delta);

    if (page - delta < 1) {
      end = Math.min(totalPages, end + (delta - page + 1));
    }

    if (page + delta > totalPages) {
      start = Math.max(1, start - (page + delta - totalPages));
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const fromRecord = (page - 1) * pageSize + 1;
  const toRecord = Math.min(page * pageSize, total);
  const totalEntries = total;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-4 text-sm text-[#4f6553]">
      {showTotal ? (
        <div>{`Showing ${fromRecord} to ${toRecord} of ${totalEntries} entries`}</div>
      ) : null}

      <div className="flex items-center justify-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-none">
        <PaginateButton
          onClick={handleFirst}
          disabled={page === 1}
          className="hidden md:inline-flex"
        >
          First
        </PaginateButton>

        <PaginateButton onClick={handlePrevious} disabled={page === 1}>
          <span className="hidden md:inline">Previous</span>
          <span className="md:hidden">&lt;</span>
        </PaginateButton>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`inline-flex h-8 md:h-10 min-w-[30px] md:min-w-[38px] items-center justify-center rounded-full border px-1.5 md:px-3 text-[11px] md:text-sm font-semibold ${
              pageNumber === page
                ? 'border-[#2d6a4e] bg-[#2d6a4e] text-white'
                : 'border-[#d6ded4] bg-white text-[#4f6553] hover:bg-[#f5fbf5]'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <PaginateButton onClick={handleNext} disabled={page === totalPages}>
          <span className="hidden md:inline">Next</span>
          <span className="md:hidden">&gt;</span>
        </PaginateButton>

        <PaginateButton
          onClick={handleLast}
          disabled={page === totalPages}
          className="hidden md:inline-flex"
        >
          Last
        </PaginateButton>
      </div>
    </div>
  );
}
