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
 * Encodes the message content as base64 directly in the share URL.
 * No external API needed — works offline, no CORS issues, never fails.
 *
 * URL format: https://poultrybot.netlify.app/share?msg=<base64>
 *
 * SharedView decodes the base64 from the URL param on load.
 *
 * @param {string} messageContent
 * @returns {Promise<string>} The share URL (resolves immediately)
 */
export async function buildShareUrl(messageContent) {
  try {
    // Encode content as base64 (handles unicode via encodeURIComponent)
    const encoded = btoa(unescape(encodeURIComponent(messageContent)));
    const base = window.location.origin;
    return `${base}/share?msg=${encoded}`;
  } catch (err) {
    throw new Error("Could not create share link. The response may be too long.");
  }
}