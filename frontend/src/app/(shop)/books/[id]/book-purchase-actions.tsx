'use client';

import { useMemo, useState, createContext, useContext } from 'react';

type PurchaseCtx = {
  quantity: number;
  canBuy: boolean;
  helperText: string;
  decrease: () => void;
  increase: () => void;
};

const PurchaseContext = createContext<PurchaseCtx | null>(null);

function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error('Must be used within BookPurchaseProvider');
  return ctx;
}

type ProviderProps = {
  stock: number;
  isInStock: boolean;
  children: React.ReactNode;
};

export function BookPurchaseProvider({
  stock,
  isInStock,
  children,
}: ProviderProps) {
  const maxQuantity = Math.max(1, stock || 1);
  const [quantity, setQuantity] = useState(1);
  const canBuy = isInStock && stock > 0;
  const helperText = useMemo(() => {
    if (!canBuy) return 'Out of stock';
    return `${stock} in stock`;
  }, [canBuy, stock]);

  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increase = () => setQuantity((prev) => Math.min(maxQuantity, prev + 1));

  return (
    <PurchaseContext.Provider
      value={{ quantity, canBuy, helperText, decrease, increase }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function PriceAndQuantity({ price }: { price: string }) {
  const { quantity, canBuy, helperText, decrease, increase } = usePurchase();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="rounded-xl py-2.5 text-2xl font-extrabold tracking-tight text-[#1B4332]">
        {price}
      </div>

      <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#cad6cc] bg-white">
        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= 1}
          className="h-9 w-9 text-base font-bold text-[#2b352f] enabled:hover:bg-[#eff5ef] disabled:cursor-not-allowed disabled:text-[#9aa59f]"
        >
          −
        </button>
        <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#cad6cc] px-2 text-sm font-semibold text-[#2b352f]">
          {quantity}
        </span>
        <button
          type="button"
          onClick={increase}
          disabled={!canBuy || quantity >= 99}
          className="h-9 w-9 text-base font-bold text-[#2b352f] enabled:hover:bg-[#eff5ef] disabled:cursor-not-allowed disabled:text-[#9aa59f]"
        >
          +
        </button>
      </div>

      <span className="text-sm text-[#58615b]">{helperText}</span>
    </div>
  );
}

export function PurchaseButtons() {
  const { quantity, canBuy } = usePurchase();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={!canBuy}
        className="flex-1 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-bold text-[#e6ffef] transition-all enabled:hover:bg-[#245740] enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-[#a7b9ad]"
      >
        Buy now
      </button>
      <button
        type="button"
        disabled={!canBuy}
        className="flex-1 rounded-xl bg-[#3f6754] px-4 py-2.5 text-sm font-bold text-[#e6ffef] transition-all enabled:hover:bg-[#335b48] enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-[#a7b9ad]"
      >
        Add to cart ({quantity})
      </button>
    </div>
  );
}
