'use client';

import { ShoppingCart } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { addCartItem, StoredCartItem } from '../cart/cart-storage';
import { addCartItemService } from '../cart/cart.service';

type AddToCartButtonProps = {
  item: StoredCartItem;
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setSubmitting(true);
      await addCartItemService(item);
      addCartItem(item);
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

  return (
    <button
      type="button"
      disabled={!item.isAvailable || submitting}
      onClick={handleAddToCart}
      className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#2d6a4f] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1b4332] transition-colors hover:bg-[#2d6a4f] hover:text-white"
    >
      <ShoppingCart size={13} strokeWidth={2.5} />
      {submitting
        ? 'Adding'
        : added
          ? 'Added'
          : item.isAvailable
            ? 'Add to cart'
            : 'Sold out'}
    </button>
  );
}
