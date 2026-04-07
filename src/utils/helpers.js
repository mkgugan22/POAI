/**
 * Generate a unique ID string with an optional prefix.
 */
export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Truncate text to a given character limit, appending "…" if cut.
 */
export function truncate(text, limit = 40) {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
}

/**
 * Format a timestamp (ms) to a human-readable HH:MM time string.
 */
export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Download plain-text content as a .txt file.
 */
export function downloadAsText(content, filename = "response.txt") {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard and return a promise that resolves on success.
 */
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

/**
 * Build a shareable URL for a chat message snippet.
 */
export function buildShareUrl(messageContent) {
  const snippet = encodeURIComponent(messageContent.slice(0, 120));
  return `https://poultry-expert.app/share?msg=${snippet}&utm_source=chat`;
}
