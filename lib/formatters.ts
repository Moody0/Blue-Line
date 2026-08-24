import { CURRENCY } from "./constants";

/**
 * Formats a numeric price to clean Egyptian currency string (e.g. "4,950 ج.م") without trailing period
 */
export function formatPrice(price: number): string {
  try {
    const rounded = Math.round(price || 0);
    const formatted = new Intl.NumberFormat("en-US").format(rounded);
    return `${formatted} ${CURRENCY.symbol}`;
  } catch {
    return `${Math.round(price || 0)} ${CURRENCY.symbol}`;
  }
}

/**
 * Calculates discount percentage between base price and discounted price
 */
export function formatDiscount(original: number, discounted: number): number {
  if (original <= 0 || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

/**
 * Formats date strings to readable localized dates
 */
export function formatDate(dateString: string, locale: string = CURRENCY.locale): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

/**
 * Localized number formatting (e.g. 5,000 or ٥٬٠٠٠)
 */
export function formatNumber(num: number, locale: string = CURRENCY.locale): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return num.toString();
  }
}
