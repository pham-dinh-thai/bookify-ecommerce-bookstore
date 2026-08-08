'use client';

import { useTranslations } from 'next-intl';
import { BadgeCheck, Pencil, Trash2 } from 'lucide-react';
import { Review } from '../types';
import RatingStars from './rating-stars';

type ReviewListProps = {
  reviews: Review[];
  averageRating: number | null;
  reviewCount: number;
  myReviewId: string | null;
  deletingId: string | null;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ReviewList({
  reviews,
  averageRating,
  reviewCount,
  myReviewId,
  deletingId,
  onEdit,
  onDelete,
}: ReviewListProps) {
  const t = useTranslations('reviews');

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-[#d4dfd7] bg-white px-5 py-10 text-center">
        <p className="text-sm font-medium text-[#58615b]">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {averageRating !== null && (
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-[#2b352f]">
            {averageRating}
          </span>
          <div>
            <RatingStars value={averageRating} size={18} />
            <p className="mt-0.5 text-xs font-medium text-[#737d76]">
              {t('reviewCount', { count: reviewCount })}
            </p>
          </div>
        </div>
      )}

      <ul className="divide-y divide-[#e6ece8] rounded-xl border border-[#d4dfd7] bg-white">
        {reviews.map((review) => {
          const isMine = review.id === myReviewId;
          const isDeleting = review.id === deletingId;

          return (
            <li key={review.id} className="flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f] text-sm font-bold text-white">
                {getInitials(review.userName)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-bold text-[#2b352f]">
                    {review.userName}
                  </span>
                  {isMine && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#eff5ef] px-2 py-0.5 text-[11px] font-semibold text-[#2d6a4f]">
                      <BadgeCheck size={12} />
                      {t('verifiedPurchase')}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-[#8b948f]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-1">
                  <RatingStars value={review.rating} size={14} />
                </div>

                {review.comment && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#58615b]">
                    {review.comment}
                  </p>
                )}

                {isMine && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(review)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#2d6a4f]/25 px-3 py-1.5 text-xs font-semibold text-[#2d6a4f] transition-colors hover:bg-[#f0f7f3] disabled:opacity-50"
                    >
                      <Pencil size={13} />
                      {t('edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(review)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      {isDeleting ? '...' : t('delete')}
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
