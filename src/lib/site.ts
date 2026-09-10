/**
 * Central business/site configuration.
 *
 * Values are read from Vite environment variables so the business owner can
 * change contact details, fees and URLs without touching code. Every value
 * has a safe fallback so the site renders sensibly even when optional
 * variables are not configured.
 */

const env = (key: string, fallback = ""): string =>
  (import.meta.env[key] as string | undefined)?.trim() || fallback;

export const siteConfig = {
  name: "Vachoma Empire",
  tagline: "Premium fashion design & authentic Bole cuisine in Port Harcourt",
  siteUrl: env("VITE_SITE_URL", "https://vachomaempire.com"),

  contact: {
    /** WhatsApp-enabled phone in international format without "+" (e.g. 2348012345678). Empty = not configured. */
    phoneIntl: env("VITE_BUSINESS_PHONE", ""),
    /** Human-readable display version of the phone number. */
    phoneDisplay: env("VITE_BUSINESS_PHONE", "")
      ? `+${env("VITE_BUSINESS_PHONE", "")}`
      : "",
    email: env("VITE_BUSINESS_EMAIL", "info@vachomaempire.com"),
    address: env("VITE_BUSINESS_ADDRESS", "Port Harcourt, Rivers State, Nigeria"),
    hours: [
      env("VITE_BUSINESS_HOURS_WEEKDAY", "Monday – Friday: 9:00 AM – 6:00 PM"),
      env("VITE_BUSINESS_HOURS_SATURDAY", "Saturday: 10:00 AM – 4:00 PM"),
      env("VITE_BUSINESS_HOURS_SUNDAY", "Sunday: Closed"),
    ],
  },

  food: {
    /** Flat delivery fee in NGN applied to delivery orders. */
    deliveryFeeNGN: Number(env("VITE_DELIVERY_FEE_NGN", "1000")) || 1000,
  },

  social: {
    instagram: "https://instagram.com/vachomaempire",
    facebook: "https://facebook.com/vachomaempire",
    tiktok: "https://tiktok.com/@vachomaempire",
  },
} as const;

/** Build a WhatsApp deep link for the business number, or null when unconfigured. */
export function whatsappLink(message: string): string | null {
  if (!siteConfig.contact.phoneIntl) return null;
  return `https://wa.me/${siteConfig.contact.phoneIntl}?text=${encodeURIComponent(message)}`;
}

/** Format a kobo-free NGN amount, e.g. 25000 → "₦25,000". */
export function formatNGN(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}
