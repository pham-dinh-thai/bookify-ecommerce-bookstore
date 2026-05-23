export type StoredCartItem = {
  id: string;
  title: string;
  author: string;
  edition: string;
  price: number;
  quantity: number;
  stock: number;
  cover: string;
  isAvailable: boolean;
};

export const CART_STORAGE_KEY = 'bookify-cart-items';
export const CART_UPDATED_EVENT = 'bookify-cart-updated';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function readCartItems(): StoredCartItem[] {
  if (!canUseStorage()) return [];

  try {
    const rawItems = window.localStorage.getItem(CART_STORAGE_KEY);
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

export function writeCartItems(items: StoredCartItem[]): void {
  if (!canUseStorage()) return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
}

export function addCartItem(item: StoredCartItem): StoredCartItem[] {
  const currentItems = readCartItems();
  const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);
  const nextItems = existingItem
    ? currentItems.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: Math.min(
                Math.max(cartItem.stock, 1),
                cartItem.quantity + item.quantity,
              ),
              stock: item.stock,
              isAvailable: item.isAvailable,
            }
          : cartItem,
      )
    : [item, ...currentItems];

  writeCartItems(nextItems);
  return nextItems;
}
