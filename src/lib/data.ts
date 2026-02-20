import settings from "../data/generated/settings.json";
import locations from "../data/generated/locations.json";
import pages from "../data/generated/pages.json";
import faq from "../data/generated/faq.json";

export { settings, locations, pages, faq };

export function bool(v: unknown): boolean {
  const s = (v ?? "").toString().trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

export function cleanPhone(phone?: string) {
  if (!phone) return "";
  // keep + and digits
  return phone.replace(/[^\d+]/g, "");
}

export function absoluteUrl(pathname: string) {
  const base = (settings.site_url || "https://menya-torikin.com").replace(/\/$/, "");
  return base + (pathname.startsWith("/") ? pathname : `/${pathname}`);
}
