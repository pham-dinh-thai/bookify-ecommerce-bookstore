'use client';

import Link from 'next/link';
import {
  Bookmark,
  Check,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { readCartItems, StoredCartItem, writeCartItems } from './cart-storage';

const initialItems: StoredCartItem[] = [
  {
    id: 'idiot-limited',
    title: 'Chàng Ngốc - Ấn Bản Giới Hạn',
    author: 'Fyodor Dostoevsky',
    edition: 'Leather Bound Edition',
    price: 1000000,
    quantity: 1,
    stock: 4,
    cover:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=420&q=80',
    isAvailable: true,
  },
  {
    id: 'war-and-peace',
    title: 'War And Peace',
    author: 'Leo Tolstoy',
    edition: 'Hardcover Archive',
    price: 378000,
    quantity: 0,
    stock: 0,
    cover:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80',
    isAvailable: false,
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    edition: 'Clothbound Folio',
    price: 550000,
    quantity: 1,
    stock: 8,
    cover:
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=420&q=80',
    isAvailable: true,
  },
];

const shippingFee = 25000;
const taxFee = 15000;

function getInitialItems(): StoredCartItem[] {
  const storedItems = readCartItems();
  return storedItems.length > 0 ? storedItems : initialItems;
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString('vi-VN')} VNĐ`;
}

export default function CartPage() {
  const [items, setItems] = useState<StoredCartItem[]>(getInitialItems);
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    getInitialItems()
      .filter((item) => item.isAvailable)
      .map((item) => item.id),
  );
  const [savedItems, setSavedItems] = useState<StoredCartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
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

  const discount =
    appliedPromo && subtotal > 0
      ? Math.min(Math.round(subtotal * 0.1), 150000)
      : 0;
  const total = subtotal > 0 ? subtotal + shippingFee + taxFee - discount : 0;

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

  const removeItem = (id: string): void => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) =>
      current.filter((selectedId) => selectedId !== id),
    );
  };

  const saveForLater = (id: string): void => {
    const item = items.find((cartItem) => cartItem.id === id);
    if (!item) return;

    setSavedItems((current) => [item, ...current]);
    removeItem(id);
  };

  const moveToCart = (id: string): void => {
    const item = savedItems.find((savedItem) => savedItem.id === id);
    if (!item) return;

    setItems((current) => [item, ...current]);
    setSavedItems((current) =>
      current.filter((savedItem) => savedItem.id !== id),
    );
    if (item.isAvailable) {
      setSelectedIds((current) => [...current, item.id]);
    }
  };

  const applyPromo = (): void => {
    const normalizedCode = promoCode.trim();
    if (!normalizedCode) {
      setPromoMessage('Enter a discount code first.');
      return;
    }

    setAppliedPromo(normalizedCode.toUpperCase());
    setPromoMessage(
      `Code ${normalizedCode.toUpperCase()} applied for 10% off.`,
    );
    setPromoCode('');
  };

  const checkout = (): void => {
    if (selectedAvailableItems.length === 0) return;

    setCheckoutMessage(
      `Checkout ready for ${selectedAvailableItems.length} item${
        selectedAvailableItems.length > 1 ? 's' : ''
      } at ${formatCurrency(total)}.`,
    );
  };

  return (
    <section className="min-h-screen bg-[#fdfcf8] text-[#1b4332]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 flex flex-col gap-3 border-b border-[#1b4332]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#1b4332]/55">
              Shopping Archive
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
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
              <div className="flex items-center justify-between rounded-lg bg-white p-5 shadow-sm">
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
              <div className="rounded-lg border border-dashed border-[#1b4332]/20 bg-white p-10 text-center">
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
                  className="rounded-lg border border-[#1b4332]/10 bg-white p-4 shadow-sm transition-colors hover:border-[#1b4332]/30 sm:p-6"
                >
                  <div className="grid grid-cols-[auto_88px_1fr] gap-4 sm:grid-cols-[auto_128px_1fr] sm:gap-6">
                    <div className="flex items-center">
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
                          className={`text-lg font-bold leading-tight sm:text-xl ${
                            item.isAvailable
                              ? ''
                              : 'text-[#1b4332]/50 line-through'
                          }`}
                        >
                          {item.title}
                        </h2>
                        <p
                          className={`mt-1 text-sm ${
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
                        className={`mt-6 flex flex-col gap-4 border-t border-[#1b4332]/5 pt-4 sm:flex-row sm:items-center sm:justify-between ${
                          item.isAvailable
                            ? ''
                            : 'pointer-events-none opacity-50 grayscale'
                        }`}
                      >
                        <div className="inline-flex w-fit items-center overflow-hidden rounded-md border border-[#1b4332]/20 bg-[#f7f3e9]/45">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 'decrease')}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease ${item.title} quantity`}
                            className="flex h-9 w-9 items-center justify-center transition-colors enabled:hover:bg-[#e7f2ea] disabled:cursor-not-allowed disabled:text-[#1b4332]/30"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="flex h-9 min-w-11 items-center justify-center border-x border-[#1b4332]/10 px-3 text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 'increase')}
                            disabled={item.quantity >= item.stock}
                            aria-label={`Increase ${item.title} quantity`}
                            className="flex h-9 w-9 items-center justify-center transition-colors enabled:hover:bg-[#e7f2ea] disabled:cursor-not-allowed disabled:text-[#1b4332]/30"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <p className="text-lg font-bold">
                          {formatCurrency(
                            item.price * Math.max(item.quantity, 1),
                          )}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                        {item.isAvailable && (
                          <button
                            type="button"
                            onClick={() => saveForLater(item.id)}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1b4332]/60 transition-colors hover:text-[#1b4332]"
                          >
                            <Bookmark size={16} />
                            Save for Later
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700/70 transition-colors hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}

            {savedItems.length > 0 && (
              <section className="rounded-lg border border-[#1b4332]/10 bg-white p-5">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.2em]">
                  Saved for Later
                </h2>
                <div className="mt-4 space-y-3">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-t border-[#1b4332]/5 pt-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#1b4332]/55">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => moveToCart(item.id)}
                        className="shrink-0 rounded-md border border-[#1b4332]/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-[#1b4332] hover:text-white"
                      >
                        Move to cart
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-lg bg-[#1b4332] p-6 text-white shadow-xl sm:p-8">
              <h2 className="mb-8 border-b border-white/20 pb-4 text-lg font-bold uppercase tracking-[0.18em] sm:text-xl">
                Acquisition Summary
              </h2>
              <div className="mb-8 space-y-4">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span className="flex items-center gap-2">
                    Eco-Shipping <Info size={13} />
                  </span>
                  <span>
                    {subtotal > 0 ? formatCurrency(shippingFee) : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Acquisition Tax</span>
                  <span>{subtotal > 0 ? formatCurrency(taxFee) : '—'}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#b7f7ca]">
                    <span>Discount ({appliedPromo})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-white/20 pt-4">
                  <span className="text-lg font-bold uppercase tracking-[0.16em]">
                    Total
                  </span>
                  <span className="text-3xl font-extrabold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="mb-8 flex items-center justify-center gap-3 rounded-md border border-white/5 bg-white/10 p-3">
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

            <section className="rounded-lg border border-[#1b4332]/10 bg-white p-6">
              <label
                className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[#1b4332]/60"
                htmlFor="promo"
              >
                Institutional Discount
              </label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyPromo();
                  }}
                  placeholder="Enter code"
                  className="min-w-0 flex-1 rounded-md border border-transparent bg-[#f7f3e9] px-4 text-sm outline-none transition-shadow focus:ring-1 focus:ring-[#1b4332]"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="rounded-md bg-[#1b4332] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`mt-3 text-xs font-semibold ${
                    appliedPromo ? 'text-[#2d6a4f]' : 'text-red-700'
                  }`}
                >
                  {promoMessage}
                </p>
              )}
            </section>

            <section className="rounded-lg border border-dashed border-[#1b4332]/20 bg-[#f7f3e9] p-6">
              <p className="text-center text-xs italic leading-6 text-[#1b4332]/60">
                &quot;Every volume added to the archive contributes to the
                preservation of human narrative.&quot;
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
