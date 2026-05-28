'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, createContext, useContext } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { addCartItem, StoredCartItem } from '../../cart/cart-storage';
import { addCartItemService } from '../../cart/cart.service';

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

type PurchaseButtonsProps = {
  book: Omit<StoredCartItem, 'quantity'>;
};

export function PurchaseButtons({ book }: PurchaseButtonsProps) {
  const { quantity, canBuy } = usePurchase();
  const router = useRouter();
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cartItem: StoredCartItem = {
    ...book,
    quantity,
    isAvailable: canBuy,
  };

  const handleAddToCart = async () => {
    try {
      setSubmitting(true);
      await addCartItemService(cartItem);
      addCartItem(cartItem);
      setAdded(true);
      toast?.addToast('Added to cart successfully', 'success');
      window.setTimeout(() => setAdded(false), 1400);
    } catch (error) {
      toast?.addToast(
        error instanceof Error ? error.message : 'Failed to add item to cart',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setSubmitting(true);
      await addCartItemService(cartItem);
      addCartItem(cartItem);
      toast?.addToast('Added to cart successfully', 'success');
      router.push('/cart');
    } catch (error) {
      toast?.addToast(
        error instanceof Error ? error.message : 'Failed to add item to cart',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={!canBuy || submitting}
        className="rounded-xl bg-[#2d6a4f] px-6 py-2.5 text-sm font-bold text-[#e6ffef] transition-all enabled:hover:bg-[#245740] enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-[#a7b9ad]"
      >
        Buy now
      </button>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canBuy || submitting}
        aria-label={`Add ${quantity} item${quantity > 1 ? 's' : ''} to cart`}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#1b4332] transition-colors enabled:hover:bg-[#eff5ef] disabled:cursor-not-allowed disabled:text-[#9aa59f]"
      >
        <ShoppingCart size={20} strokeWidth={2} />
        <span>{submitting ? 'Adding' : added ? 'Added' : 'Cart'}</span>
      </button>
    </div>
  );
}
