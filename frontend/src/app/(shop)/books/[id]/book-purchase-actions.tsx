'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type BookPurchaseActionsProps = {
  stock: number;
  isInStock: boolean;
};

export default function BookPurchaseActions({
  stock,
  isInStock,
}: BookPurchaseActionsProps) {
  const maxQuantity = Math.max(1, stock || 1);
  const [quantity, setQuantity] = useState(1);

  const canBuy = isInStock && stock > 0;
  const helperText = useMemo(() => {
    if (!canBuy) return 'Book is out of stock';
    return ` ${stock} books in stock`;
  }, [canBuy, stock]);

  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increase = () => setQuantity((prev) => Math.min(maxQuantity, prev + 1));

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#58615b]">Quantity</span>
        <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#cad6cc] bg-white">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            className="h-10 w-10 text-xl font-bold text-[#2b352f] enabled:hover:bg-[#eff5ef] disabled:cursor-not-allowed disabled:text-[#9aa59f]"
          >
            -
          </button>
          <span className="flex h-10 min-w-12 items-center justify-center border-x border-[#cad6cc] px-3 font-semibold text-[#2b352f]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            disabled={!canBuy || quantity >= maxQuantity}
            className="h-10 w-10 text-xl font-bold text-[#2b352f] enabled:hover:bg-[#eff5ef] disabled:cursor-not-allowed disabled:text-[#9aa59f]"
          >
            +
          </button>
        </div>
        <span className="text-sm text-[#58615b]">{helperText}</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          disabled={!canBuy}
          className="rounded-xl bg-[#2d6a4f] px-8 py-4 text-lg font-bold text-[#e6ffef] transition-all enabled:hover:bg-[#245740] enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-[#a7b9ad]"
        >
          Buy now
        </button>
        <button
          type="button"
          disabled={!canBuy}
          className="rounded-xl bg-[#3f6754] px-8 py-4 text-lg font-bold text-[#e6ffef] transition-all enabled:hover:bg-[#335b48] enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-[#a7b9ad]"
        >
          Add to cart ({quantity})
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/books"
          className="inline-flex rounded-xl bg-[#e2eae3] px-8 py-4 text-lg font-bold text-[#2b352f] transition-all hover:bg-[#dbe5dd] active:scale-95"
        >
          Back to Books
        </Link>
      </div>
    </div>
  );
}
