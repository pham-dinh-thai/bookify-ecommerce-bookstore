'use client';

import { ShoppingCart } from 'lucide-react';

export function AddToCartButton() {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        // TODO: dispatch add to cart action
      }}
      className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#2d6a4f] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1b4332] transition-colors hover:bg-[#2d6a4f] hover:text-white"
    >
      <ShoppingCart size={13} strokeWidth={2.5} />
      Add to cart
    </button>
  );
}
