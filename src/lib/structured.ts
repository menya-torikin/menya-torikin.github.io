import { absoluteUrl, cleanPhone } from "./data";

function postalAddress(loc: any) {
  return {
    "@type": "PostalAddress",
    "streetAddress": loc.address_line || "",
    "postalCode": loc.postal_code || "",
    "addressLocality": loc.city || "",
    "addressRegion": loc.region || "",
    "addressCountry": loc.country || "TW"
  };
}

function geo(loc: any) {
  const lat = (loc.lat ?? "").toString().trim();
  const lng = (loc.lng ?? "").toString().trim();
  if (!lat || !lng) return undefined;
  return { "@type": "GeoCoordinates", "latitude": Number(lat), "longitude": Number(lng) };
}

export function organizationJsonLd(settings: any, locations: any[]) {
  const orgUrl = absoluteUrl("/");
  const deps = locations.map((loc) => restaurantJsonLd(settings, loc, false));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.brand_name_zh || settings.site_name || "麵屋雞金",
    "alternateName": settings.brand_name_en || "Menya Torikin",
    "url": orgUrl,
    ...(settings.logo_url ? { "logo": settings.logo_url } : {}),
    ...(settings.instagram_url ? { "sameAs": [settings.instagram_url].filter(Boolean) } : {}),
    "department": deps
  };
}

export function websiteJsonLd(settings: any) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": settings.site_name || "麵屋雞金 Menya Torikin",
    "url": absoluteUrl("/")
  };
}

export function restaurantJsonLd(settings: any, loc: any, withContext = true) {
  const url = absoluteUrl(`/locations/${loc.slug}/`);
  const obj: any = {
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Restaurant",
    "name": `${settings.brand_name_zh || "麵屋雞金"} ${loc.name || ""}`.trim(),
    "url": url,
    ...(loc.hero_image ? { "image": loc.hero_image } : (settings.og_default_image ? { "image": settings.og_default_image } : {})),
    "address": postalAddress(loc),
    ...(cleanPhone(loc.phone) ? { "telephone": cleanPhone(loc.phone) } : {}),
    ...(loc.hours ? { "openingHours": [loc.hours] } : {}),
    ...(geo(loc) ? { "geo": geo(loc) } : {}),
    ...(loc.gmaps_url ? { "hasMap": loc.gmaps_url } : {})
  };
  return obj;
}

export function faqPageJsonLd(faqItems: any[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((x) => ({
      "@type": "Question",
      "name": x.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": x.answer_html ?? x.answer_md ?? ""
      }
    })),
    "url": pageUrl
  };
}
