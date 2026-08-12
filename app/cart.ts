export const CART_STORAGE_KEY = "natpe-thunai-cart";

export type CartItem = {
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
};

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
