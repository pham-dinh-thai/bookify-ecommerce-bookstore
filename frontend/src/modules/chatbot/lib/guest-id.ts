const GUEST_ID_KEY = 'bookify_guest_id';

export function getGuestId(): string {
  if (typeof window === 'undefined') return '';

  let id = window.localStorage.getItem(GUEST_ID_KEY);

  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, id);
  }

  return id;
}
