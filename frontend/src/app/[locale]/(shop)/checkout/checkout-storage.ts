import { StoredCartItem } from '../cart/cart-storage';

export const CHECKOUT_STORAGE_KEY = 'bookify-checkout-items';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function readCheckoutItems(): StoredCartItem[] {
  if (!canUseStorage()) return [];

  try {
    const rawItems = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!rawItems) return [];

    const parsedItems = JSON.parse(rawItems);
    if (!Array.isArray(parsedItems)) return [];

    return parsedItems.filter((item): item is StoredCartItem => {
      return (
        typeof item?.id === 'string' &&
        typeof item?.title === 'string' &&
        typeof item?.price === 'number' &&
        typeof item?.quantity === 'number'
      );
    });
  } catch {
    return [];
  }
}

export function writeCheckoutItems(items: StoredCartItem[]): void {
  if (!canUseStorage()) return;

  window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(items));
}

export function clearCheckoutItems(): void {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
}
