import type { ReactNode } from 'react';
import { BookDetail } from '@/app/staff/books/types';

export default function BookDetailHeader({
  book,
  action,
}: {
  book: BookDetail;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2
          className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
          style={{ color: '#2b352f' }}
        >
          <span className="italic mb-3" style={{ color: '#335b48' }}>
            {book.title}
          </span>
        </h2>

        <br />

        <p className="text-xl font-medium text-[#58615b]">
          {book.authors.join(', ')}
        </p>
      </div>
      {action}
    </div>
  );
}
