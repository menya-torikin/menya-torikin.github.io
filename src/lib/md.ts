import { marked } from "marked";

// Basic markdown -> HTML.
// Note: content comes from your own Google Sheet; avoid accepting untrusted HTML.
export function mdToHtml(md?: string) {
  if (!md) return "";
  return marked.parse(md, { mangle: false, headerIds: false });
}
