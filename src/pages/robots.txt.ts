export const prerender = true;

export function GET({ site }) {
  const base = (site?.toString() || "https://menya-torikin.com").replace(/\/$/, "");
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${base}/sitemap-index.xml`,
    ""
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
