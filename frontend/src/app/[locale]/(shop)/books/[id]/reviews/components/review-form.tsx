'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import RatingInput from './rating-input';

type ReviewFormProps = {
  initialRating?: number;
  initialComment?: string;
  submitLabel: string;
  onSubmit: (input: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
};

export default function ReviewForm({
  initialRating = 0,
  initialComment = '',
  submitLabel,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const t = useTranslations('reviews');
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (rating <= 0) return;

    setSubmitting(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-4 rounded-xl border border-[#d4dfd7] bg-white p-5 md:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#2b352f]">
          {t('ratingLabel')}
        </span>
        <RatingInput value={rating} onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={t('placeholder')}
        rows={4}
        maxLength={2000}
        className="w-full resize-y rounded-lg border border-[#d4dfd7] bg-[#fbfdfb] p-3 text-sm leading-relaxed text-[#2b352f] outline-none transition-colors focus:border-[#2d6a4f]"
      />

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#58615b] transition-colors hover:bg-[#eff5ef]"
          >
            {t('cancel')}
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || rating <= 0}
          className="inline-flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3d2b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
