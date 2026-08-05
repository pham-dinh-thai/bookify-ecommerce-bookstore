import { Wishlist, WISHLIST_MAX_ITEMS } from './wishlist.aggregate';
import { WishlistItem } from './entities/wishlist-item.entity';
import { WishlistMaxItemsReachedException } from './exceptions/wishlist-max-items-reached.exception';
import { WishlistItemNotFoundException } from './exceptions/wishlist-item-not-found.exception';

describe('Wishlist aggregate', () => {
  const baseWishlist = () =>
    Wishlist.create({ id: 'wishlist-1', userId: 'user-1' });

  describe('addItem', () => {
    it('adds a new item', () => {
      const wishlist = baseWishlist();
      const item = wishlist.addItem({ id: 'item-1', itemId: 'book-1' });

      expect(item).toBeInstanceOf(WishlistItem);
      expect(wishlist.getItems()).toHaveLength(1);
    });

    it('returns the existing item when the book is already in the wishlist', () => {
      const wishlist = baseWishlist();
      const first = wishlist.addItem({ id: 'item-1', itemId: 'book-1' });
      const duplicate = wishlist.addItem({ id: 'item-2', itemId: 'book-1' });

      expect(duplicate).toBe(first);
      expect(wishlist.getItems()).toHaveLength(1);
    });

    it('allows up to 50 items', () => {
      const wishlist = baseWishlist();

      for (let i = 0; i < WISHLIST_MAX_ITEMS; i++) {
        wishlist.addItem({ id: `item-${i}`, itemId: `book-${i}` });
      }

      expect(wishlist.getItems()).toHaveLength(WISHLIST_MAX_ITEMS);
    });

    it('throws when exceeding 50 items', () => {
      const wishlist = baseWishlist();

      for (let i = 0; i < WISHLIST_MAX_ITEMS; i++) {
        wishlist.addItem({ id: `item-${i}`, itemId: `book-${i}` });
      }

      expect(() =>
        wishlist.addItem({ id: 'item-51', itemId: 'book-51' }),
      ).toThrow(WishlistMaxItemsReachedException);
    });
  });

  describe('remove', () => {
    it('removes an existing item', () => {
      const wishlist = baseWishlist();
      wishlist.addItem({ id: 'item-1', itemId: 'book-1' });

      const removed = wishlist.remove('book-1');

      expect(removed).toBe('book-1');
      expect(wishlist.getItems()).toHaveLength(0);
    });

    it('throws when the item is not in the wishlist', () => {
      const wishlist = baseWishlist();

      expect(() => wishlist.remove('book-1')).toThrow(
        WishlistItemNotFoundException,
      );
    });
  });
});
