export const CART_STORAGE_KEY = "natpe-thunai-cart";
const CART_CHANGE_EVENT = "natpe-thunai-cart-change";

export type CartItem = {
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
};

const EMPTY_CART: CartItem[] = [];
let cachedRawCart: string | null | undefined;
let cachedCart: CartItem[] = EMPTY_CART;

export function parseStoredCart(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        (item.originalPrice === undefined ||
          (typeof item.originalPrice === "number" && Number.isFinite(item.originalPrice))) &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (rawCart === cachedRawCart) return cachedCart;
  cachedRawCart = rawCart;
  cachedCart = parseStoredCart(rawCart);
  return cachedCart;
}

export function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function subscribeToCart(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CART_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CART_CHANGE_EVENT, onStoreChange);
  };
}

export function updateStoredCart(update: (current: CartItem[]) => CartItem[]) {
  const nextCart = update(getCartSnapshot());
  const rawCart = JSON.stringify(nextCart);
  window.localStorage.setItem(CART_STORAGE_KEY, rawCart);
  cachedRawCart = rawCart;
  cachedCart = nextCart;
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}
