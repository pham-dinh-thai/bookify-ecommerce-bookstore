'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { removeWishlistItemService } from '../services/wishlist.service';
import { useWishlist } from '../hooks/use-wishlist';
import { WishlistItem } from '../types';

function formatVnd(value: number): string {
  return `${Number(value).toLocaleString('vi-VN')} VNĐ`;
}

export default function WishlistScreen() {
  const t = useTranslations('wishlist');
  const tc = useTranslations('common');
  const toast = useToast();
  const { items, loading, error, retry } = useWishlist();
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const removeItem = async (item: WishlistItem): Promise<void> => {
    if (removingIds.includes(item.itemId)) return;

    setRemovingIds((current) => [...current, item.itemId]);

    try {
      await removeWishlistItemService(item.itemId);
      toast?.addToast(t('itemRemoved'), 'success');
      await retry();
    } catch (err) {
      toast?.addToast(
        err instanceof Error ? err.message : t('removeFailed'),
        'error',
      );
    } finally {
      setRemovingIds((current) =>
        current.filter((removingId) => removingId !== item.itemId),
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-8 border-b border-[#3f6754]/10 pb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#3f6754]/55">
            Bookify
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t('title')}
            {!loading && !error && items.length > 0
              ? ` (${items.length} ${t('books')})`
              : ''}
          </h1>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-10">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[3/4] rounded-lg bg-[#e7efe8]" />
                <div className="mt-3 h-4 w-3/4 rounded bg-[#e7efe8]" />
                <div className="mt-2 h-4 w-1/2 rounded bg-[#e7efe8]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#a83836]/20 bg-white p-6 sm:p-10 text-center">
            <h2 className="text-2xl font-bold text-[#2b352f]">
              {t('notLoggedIn')}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#58615b]">
              {t('notLoggedInDescription')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={retry}
                className="rounded-full bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
              >
                {tc('tryAgain')}
              </button>
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5]"
              >
                {tc('login')}
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#3f6754]/20 bg-white p-10 text-center">
            <Heart
              className="mx-auto mb-4 text-[#3f6754]/45"
              size={40}
              strokeWidth={1.8}
            />
            <h2 className="text-2xl font-bold text-[#2b352f]">
              {t('empty')}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#58615b]">
              {t('emptyDescription')}
            </p>
            <Link
              href="/books"
              className="mt-6 inline-flex rounded-full bg-[#3f6754] px-5 py-3 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
            >
              {t('browseBooks')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-10">
            {items.map((item) => (
              <WishlistCard
                key={item.itemId}
                item={item}
                removing={removingIds.includes(item.itemId)}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WishlistCard({
  item,
  removing,
  onRemove,
}: {
  item: WishlistItem;
  removing: boolean;
  onRemove: (item: WishlistItem) => void;
}) {
  const t = useTranslations('wishlist');

  return (
    <div className="group">
      <Link href={`/books/${item.itemId}`} className="block">
        <div className="relative mb-4 overflow-hidden">
          <div className="aspect-[3/4] flex items-center justify-center overflow-hidden">
            {item.cover ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.cover}
                alt={item.title}
                className={`h-full w-full object-contain transition-transform duration-700 group-hover:scale-105 ${
                  item.isAvailable ? '' : 'grayscale opacity-70'
                }`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#e7efe8] text-xs font-bold uppercase tracking-widest text-[#58615b]/50">
                Bookify
              </div>
            )}
          </div>
          {!item.isAvailable && (
            <span className="absolute left-2 top-2 rounded-full bg-red-700/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {t('unavailable')}
            </span>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              void onRemove(item);
            }}
            disabled={removing}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a83836] shadow-md opacity-0 transition-all hover:bg-[#fff5f5] group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={13} />
            {removing ? t('removing') : t('remove')}
          </button>
        </div>

        <h3 className="truncate text-md font-bold leading-tight text-[#1a3d2b] transition-colors group-hover:text-[#2d6a4f]">
          {item.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-[#58615b]">{item.author}</p>

        <div className="mt-1 flex min-h-[34px] flex-col gap-0.5">
          <p className="text-sm font-black leading-tight text-[#2d6a4f]">
            {formatVnd(item.currentPrice)}
          </p>
          {item.discountPercentage > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] leading-tight text-[#8b948f] line-through">
                {formatVnd(item.originalPrice)}
              </span>
              <span className="rounded-full bg-[#fff3e8] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#9a5524]">
                -{item.discountPercentage}%
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
