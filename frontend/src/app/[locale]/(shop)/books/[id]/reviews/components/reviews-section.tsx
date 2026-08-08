'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PenLine, Star } from 'lucide-react';
import { useAuth } from '@/shared/auth/hooks/use-auth';
import { useToast } from '@/shared/common/toast/toast';
import {
  addReviewService,
  deleteReviewService,
  findBookReviewsService,
  findMyReviewService,
  updateReviewService,
} from '../services/reviews.service';
import { BookReviews, MyReview, Review } from '../types';
import ReviewForm from './review-form';
import ReviewList from './review-list';

type ReviewsSectionProps = {
  bookId: string;
};

export default function ReviewsSection({ bookId }: ReviewsSectionProps) {
  const t = useTranslations('reviews');
  const toast = useToast();
  const { isAuth } = useAuth();

  const [data, setData] = useState<BookReviews>({
    reviews: [],
    averageRating: null,
    reviewCount: 0,
  });
  const [my, setMy] = useState<MyReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [list, mine] = await Promise.all([
        findBookReviewsService(bookId),
        isAuth ? findMyReviewService(bookId) : Promise.resolve(null),
      ]);
      setData(list);
      setMy(mine);
    } catch (error) {
      toast?.addToast(
        error instanceof Error ? error.message : t('error'),
        'error',
      );
    } finally {
      setLoading(false);
    }
  }, [bookId, isAuth, toast, t]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const openCreateForm = (): void => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (review: Review): void => {
    setEditing(review);
    setFormOpen(true);
  };

  const closeForm = (): void => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleAdd = async (input: { rating: number; comment: string }) => {
    await addReviewService(bookId, input);
    toast?.addToast(t('added'), 'success');
    closeForm();
    await load();
  };

  const handleUpdate = async (input: { rating: number; comment: string }) => {
    if (!editing) return;
    await updateReviewService(bookId, editing.id, input);
    toast?.addToast(t('updated'), 'success');
    closeForm();
    await load();
  };

  const handleDelete = async (review: Review): Promise<void> => {
    if (!window.confirm(t('deleteConfirm'))) return;
    setDeletingId(review.id);
    try {
      await deleteReviewService(bookId, review.id);
      toast?.addToast(t('deleted'), 'success');
      await load();
    } catch (error) {
      toast?.addToast(
        error instanceof Error ? error.message : t('error'),
        'error',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const canReview = isAuth && (my?.hasPurchased ?? false);
  const myReview = canReview ? (my?.review ?? null) : null;
  const showForm = canReview && formOpen;

  return (
    <section id="reviews" className="px-5 pb-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-[#2d6a4f]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#737d76]">
              {t('title')}
            </h3>
          </div>

          {canReview && !myReview && !formOpen && (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 rounded-full border border-[#2d6a4f]/25 bg-white px-4 py-2 text-sm font-semibold text-[#2d6a4f] transition-colors hover:bg-[#f0f7f3]"
            >
              <PenLine size={15} />
              {t('writeReview')}
            </button>
          )}

          {canReview && myReview && !formOpen && (
            <button
              type="button"
              onClick={() => openEditForm(myReview)}
              className="inline-flex items-center gap-2 rounded-full border border-[#2d6a4f]/25 bg-white px-4 py-2 text-sm font-semibold text-[#2d6a4f] transition-colors hover:bg-[#f0f7f3]"
            >
              <PenLine size={15} />
              {t('editReview')}
            </button>
          )}
        </div>

        {!isAuth && (
          <p className="mb-6 rounded-xl border border-[#d4dfd7] bg-white px-5 py-4 text-sm leading-relaxed text-[#58615b]">
            {t('loginRequired')}{' '}
            <Link
              href="/login"
              className="font-semibold text-[#2d6a4f] underline-offset-2 hover:underline"
            >
              {t('signIn')}
            </Link>
          </p>
        )}

        {isAuth && my !== null && !canReview && (
          <p className="mb-6 rounded-xl border border-[#d4dfd7] bg-white px-5 py-4 text-sm leading-relaxed text-[#58615b]">
            {t('purchaseRequired')}
          </p>
        )}

        {loading ? (
          <p className="rounded-xl border border-[#d4dfd7] bg-white px-5 py-10 text-center text-sm text-[#737d76]">
            {t('loading')}
          </p>
        ) : (
          <>
            <ReviewList
              reviews={data.reviews}
              averageRating={data.averageRating}
              reviewCount={data.reviewCount}
              myReviewId={myReview?.id ?? null}
              deletingId={deletingId}
              onEdit={openEditForm}
              onDelete={(review) => void handleDelete(review)}
            />

            {showForm && (
              <div className="mt-6">
                <ReviewForm
                  initialRating={editing?.rating}
                  initialComment={editing?.comment ?? ''}
                  submitLabel={editing ? t('update') : t('submit')}
                  onSubmit={editing ? handleUpdate : handleAdd}
                  onCancel={closeForm}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
