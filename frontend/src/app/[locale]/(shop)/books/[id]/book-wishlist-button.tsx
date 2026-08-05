'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { useAuth } from '@/shared/auth/hooks/use-auth';
import { useTranslations } from 'next-intl';
import {
  addWishlistItemService,
  findWishlistService,
  removeWishlistItemService,
} from '../../wishlist/services/wishlist.service';

type BookWishlistButtonProps = {
  bookId: string;
};

export default function BookWishlistButton({
  bookId,
}: BookWishlistButtonProps) {
  const t = useTranslations('bookDetail');
  const toast = useToast();
  const { isAuth } = useAuth();
  const loggedIn = isAuth;
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;

    let isActive = true;

    queueMicrotask(async () => {
      try {
        const items = await findWishlistService();
        if (isActive) {
          setSaved(items.some((item) => item.itemId === bookId));
        }
      } catch {
        // keep default unchecked state
      } finally {
        if (isActive) setLoaded(true);
      }
    });

    return () => {
      isActive = false;
    };
  }, [bookId, loggedIn]);

  if (!loggedIn) return null;

  const toggle = async (): Promise<void> => {
    setSubmitting(true);

    try {
      if (saved) {
        await removeWishlistItemService(bookId);
        setSaved(false);
        toast?.addToast(t('wishlistRemoved'), 'success');
      } else {
        await addWishlistItemService(bookId);
        setSaved(true);
        toast?.addToast(t('wishlistAdded'), 'success');
      }
    } catch (error) {
      toast?.addToast(
        error instanceof Error ? error.message : t('wishlistError'),
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={!loaded || submitting}
      aria-label={saved ? t('removeFromWishlist') : t('addToWishlist')}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#2d6a4f]/25 bg-white px-3 text-sm font-semibold text-[#2d6a4f] transition-colors enabled:hover:bg-[#f0f7f3] disabled:cursor-not-allowed disabled:text-[#9aa59f]"
    >
      <Heart size={18} strokeWidth={2} className={saved ? 'fill-[#2d6a4f]' : ''} />
      <span>{saved ? t('inWishlist') : t('addToWishlist')}</span>
    </button>
  );
}
