'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Info, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useToast } from '@/shared/common/toast/toast';
import { useEffect, useMemo, useRef, useState } from 'react';
import AuthModal from '@/shared/auth/components/auth-modal';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { readCartItems, StoredCartItem, writeCartItems } from './cart-storage';
import { removeCartItemService } from './cart.service';
import { writeCheckoutItems } from '../checkout/checkout-storage';

const shippingFee = 25000;
const taxFee = 15000;

function formatCurrency(value: number): string {
  return `${value.toLocaleString('vi-VN')} VNĐ`;
}

export default function CartPage() {
  const toast = useToast();
  const router = useRouter();
  const hasHydratedCart = useRef(false);
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) return;

      const storedItems = readCartItems();
      if (storedItems.length > 0) {
        setItems(storedItems);
        setSelectedIds(
          storedItems.filter((item) => item.isAvailable).map((item) => item.id),
        );
      }
      hasHydratedCart.current = true;
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedCart.current) return;
    writeCartItems(items);
  }, [items]);

  const availableItems = items.filter((item) => item.isAvailable);
  const selectedAvailableItems = items.filter(
    (item) => item.isAvailable && selectedIds.includes(item.id),
  );
  const isAllSelected =
    availableItems.length > 0 &&
    availableItems.every((item) => selectedIds.includes(item.id));

  const subtotal = useMemo(
    () =>
      selectedAvailableItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [selectedAvailableItems],
  );

  const total = subtotal > 0 ? subtotal + shippingFee + taxFee : 0;

  const openBookDetail = (id: string): void => {
    router.push(`/books/${encodeURIComponent(id)}`);
  };

  const toggleItem = (id: string): void => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleAll = (): void => {
    setSelectedIds(isAllSelected ? [] : availableItems.map((item) => item.id));
  };

  const updateQuantity = (id: string, direction: 'increase' | 'decrease') => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id || !item.isAvailable) return item;

        const nextQuantity =
          direction === 'increase' ? item.quantity + 1 : item.quantity - 1;

        return {
          ...item,
          quantity: Math.min(item.stock, Math.max(1, nextQuantity)),
        };
      }),
    );
  };

  const removeItem = async (id: string): Promise<boolean> => {
    try {
      setRemovingIds((current) => [...current, id]);
      await removeCartItemService(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setSelectedIds((current) =>
        current.filter((selectedId) => selectedId !== id),
      );
      toast?.addToast('Item removed from cart', 'success');
    } catch (error) {
      toast?.addToast(
        error instanceof Error
          ? error.message
          : 'Failed to remove item from cart',
        'error',
      );
      return false;
    } finally {
      setRemovingIds((current) =>
        current.filter((removingId) => removingId !== id),
      );
    }

    return true;
  };

  const checkout = (): void => {
    if (selectedAvailableItems.length === 0) return;

    if (!getAccessToken()) {
      setShowAuthModal(true);
      return;
    }

    writeCheckoutItems(selectedAvailableItems);
    setCheckoutMessage(null);
    router.push('/checkout');
  };

  const handleAuthSuccess = (): void => {
    setShowAuthModal(false);
    writeCheckoutItems(selectedAvailableItems);
    setCheckoutMessage(null);
    router.push('/checkout');
  };

  return (
    <>
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      <section className="min-h-screen bg-[#fdfcf8] text-[#1b4332]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 flex flex-col gap-3 border-b border-[#1b4332]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#1b4332]/55">
              Shopping Archive
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              My Cart ({items.length} books)
            </h1>
          </div>
          <p className="text-sm font-medium italic text-[#1b4332]/60">
            {selectedAvailableItems.length} curated items selected
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-8">
            {items.length > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-white p-4 sm:p-5 shadow-sm">
                <label className="group flex cursor-pointer items-center gap-3">
                  <span className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleAll}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#1b4332]/20 bg-white transition-all checked:bg-[#1b4332]"
                    />
                    <Check
                      size={14}
                      strokeWidth={3.5}
                      className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#1b4332] sm:text-sm">
                    Select All
                  </span>
                </label>
                <span className="text-xs font-semibold text-[#1b4332]/50">
                  {availableItems.length} available
                </span>
              </div>
            )}

            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#1b4332]/20 bg-white p-6 sm:p-10 text-center">
                <ShoppingBag
                  className="mx-auto mb-4 text-[#1b4332]/45"
                  size={38}
                />
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#1b4332]/60">
                  Add a few archive-ready volumes to start building your order.
                </p>
                <Link
                  href="/books"
                  className="mt-6 inline-flex rounded-md bg-[#1b4332] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
                >
                  Browse books
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => openBookDetail(item.id)}
                  onKeyDown={(event) => {
                    if (event.currentTarget !== event.target) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openBookDetail(item.id);
                    }
                  }}
                  className="cursor-pointer rounded-lg border border-[#1b4332]/10 bg-white p-4 shadow-sm transition-colors hover:border-[#1b4332]/30 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/25 sm:p-6"
                >
                  <div className="grid grid-cols-[auto_80px_1fr] gap-3 sm:grid-cols-[auto_128px_1fr] sm:gap-6">
                    <div
                      className="flex items-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          disabled={!item.isAvailable}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#1b4332]/20 bg-white transition-all checked:bg-[#1b4332] disabled:cursor-not-allowed disabled:bg-[#e8e2d6]"
                        />
                        <Check
                          size={14}
                          strokeWidth={3.5}
                          className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        />
                      </span>
                    </div>

                    <div className="aspect-[8/11] overflow-hidden bg-[#f7f3e9]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={`${item.title} cover`}
                        src={item.cover}
                        className={`h-full w-full object-cover ${
                          item.isAvailable ? '' : 'grayscale opacity-70'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div>
                        <h2
                          className={`text-base sm:text-lg font-bold leading-tight sm:text-xl ${
                            item.isAvailable
                              ? ''
                              : 'text-[#1b4332]/50 line-through'
                          }`}
                        >
                          {item.title}
                        </h2>
                        <p
                          className={`mt-1 text-xs sm:text-sm ${
                            item.isAvailable
                              ? 'text-[#1b4332]/60'
                              : 'text-[#1b4332]/40'
                          }`}
                        >
                          {item.author} • {item.edition}
                        </p>
                        {!item.isAvailable && (
                          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-red-700">
                            Out of stock. Please remove.
                          </p>
                        )}
                      </div>

                        <div
                        className={`mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4 border-t border-[#1b4332]/5 pt-3 sm:pt-4 sm:flex-row sm:items-center sm:justify-between ${
                          item.isAvailable
                            ? ''
                            : 'pointer-events-none opacity-50 grayscale'
                        }`}
                      >
                        <div className="inline-flex w-fit items-center overflow-hidden rounded-md border border-[#1b4332]/20 bg-[#f7f3e9]/45">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              updateQuantity(item.id, 'decrease');
                            }}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease ${item.title} quantity`}
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center transition-colors enabled:hover:bg-[#e7f2ea] disabled:cursor-not-allowed disabled:text-[#1b4332]/30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="flex h-8 sm:h-9 min-w-10 sm:min-w-11 items-center justify-center border-x border-[#1b4332]/10 px-2 sm:px-3 text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              updateQuantity(item.id, 'increase');
                            }}
                            disabled={item.quantity >= item.stock}
                            aria-label={`Increase ${item.title} quantity`}
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center transition-colors enabled:hover:bg-[#e7f2ea] disabled:cursor-not-allowed disabled:text-[#1b4332]/30"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-base sm:text-lg font-bold">
                          {formatCurrency(
                            item.price * Math.max(item.quantity, 1),
                          )}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void removeItem(item.id);
                          }}
                          disabled={removingIds.includes(item.id)}
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700/70 transition-colors hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          {removingIds.includes(item.id)
                            ? 'Removing'
                            : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-lg bg-[#1b4332] p-5 text-white shadow-xl sm:p-8">
              <h2 className="mb-6 sm:mb-8 border-b border-white/20 pb-3 sm:pb-4 text-base sm:text-lg font-bold uppercase tracking-[0.18em] sm:text-xl">
                Acquisition Summary
              </h2>
              <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span className="flex items-center gap-1.5">
                    Eco-Shipping <Info size={12} />
                  </span>
                  <span>
                    {subtotal > 0 ? formatCurrency(shippingFee) : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Acquisition Tax</span>
                  <span>{subtotal > 0 ? formatCurrency(taxFee) : '—'}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/20 pt-4">
                  <span className="text-sm sm:text-lg font-bold uppercase tracking-[0.16em]">
                    Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="mb-6 sm:mb-8 flex items-center justify-center gap-3 rounded-md border border-white/5 bg-white/10 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#52b788]">
                  <Check size={15} className="text-[#1b4332]" strokeWidth={3} />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.08em]">
                  100% Carbon Neutral Acquisition
                </span>
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={selectedAvailableItems.length === 0}
                className="w-full rounded-md bg-[#f7f3e9] py-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#1b4332] shadow-md transition-all enabled:hover:bg-white enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Proceed to Checkout
              </button>
              {checkoutMessage && (
                <p className="mt-4 rounded-md bg-white/10 p-3 text-center text-xs font-semibold leading-5 text-white/80">
                  {checkoutMessage}
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </section>
    </>
  );
}
