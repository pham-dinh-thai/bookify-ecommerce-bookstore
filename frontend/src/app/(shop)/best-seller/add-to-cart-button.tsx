'use client';

import { ShoppingCart } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { addCartItem, StoredCartItem } from '../cart/cart-storage';

type AddToCartButtonProps = {
  item: StoredCartItem;
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const toast = useToast();

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    addCartItem(item);
    setAdded(true);
    toast?.addToast('Added to cart successfully', 'success');
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      disabled={!item.isAvailable}
      onClick={handleAddToCart}
      className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#2d6a4f] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1b4332] transition-colors hover:bg-[#2d6a4f] hover:text-white"
    >
      <ShoppingCart size={13} strokeWidth={2.5} />
      {added ? 'Added' : item.isAvailable ? 'Add to cart' : 'Sold out'}
    </button>
  );
}
