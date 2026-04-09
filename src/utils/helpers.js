export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function truncate(text, limit = 40) {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit",
  });
}

export function downloadAsText(content, filename = "response.txt") {
  const blob   = new Blob([content], { type: "text/plain" });
  const url    = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href     = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

/**
 * Stores the message content server-side via the dpaste.com API
 * and returns a clean short share URL pointing to the /share route.
 *
 * URL format: https://poultrybot.netlify.app/share?sid=<dpaste-id>
 *
 * SharedView fetches the raw content from dpaste using the sid,
 * so the address bar stays clean regardless of message length.
 *
 * @param {string} messageContent
 * @returns {Promise<string>} The short share URL
 */
export async function buildShareUrl(messageContent) {
  const form = new FormData();
  form.append("content", messageContent);
  form.append("syntax",  "text");
  form.append("expiry_days", "30");

  const res = await fetch("https://dpaste.com/api/v2/", {
    method: "POST",
    body:   form,
  });

  if (!res.ok) throw new Error("Could not create share link. Please try again.");

  // dpaste returns a URL like https://dpaste.com/XXXXXXXX
  const pasteUrl = (await res.text()).trim();
  // Extract just the ID part, e.g. "XXXXXXXX"
  const sid = pasteUrl.replace(/https?:\/\/dpaste\.com\//, "").replace(/\/$/, "");

  const base = window.location.origin;
  // Use /share?sid=... so it renders as a proper shared view page
  return `${base}/share?sid=${sid}`;
}