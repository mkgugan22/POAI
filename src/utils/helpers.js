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
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      successful ? resolve() : reject(new Error("Copy failed"));
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error);
    }
  });
}

/**
 * Encode message content as base64 and return a clean /share?msg= URL.
 * No external API — works offline, never fails, no CORS issues.
 *
 * URL format: https://poultrybot.netlify.app/share?msg=<base64>
 *
 * @param {string} messageContent
 * @returns {string} The share URL (synchronous — no async needed)
 */
function base64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
      String.fromCharCode(Number(`0x${p1}`))
    )
  );
}

function base64DecodeUnicode(str) {
  try {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
  } catch {
    return null;
  }
}

export function buildShareUrl(messageContent) {
  const origin = typeof window !== "undefined"
    ? window.location.origin
    : "https://poultrybot.netlify.app";
  try {
    const encoded = base64EncodeUnicode(messageContent);
    return `${origin}/share?msg=${encodeURIComponent(encoded)}`;
  } catch {
    const safe = messageContent.slice(0, 2000);
    const encoded = base64EncodeUnicode(safe);
    return `${origin}/share?msg=${encodeURIComponent(encoded)}`;
  }
}

/**
 * Decode a share URL's base64 msg param back to the original message.
 * Returns null if decoding fails.
 *
 * @param {string} encoded  — the raw base64 string from the URL
 * @returns {string|null}
 */
export function decodeShareMsg(encoded) {
  if (!encoded) return null;
  try {
    const decodedParam = decodeURIComponent(encoded);
    return base64DecodeUnicode(decodedParam);
  } catch {
    return null;
  }
}

/**
 * Legacy helpers kept for backward compatibility with old code that
 * passed existingSid. These are no-ops now since we use base64 URLs.
 */
export function readShareMessage() { return null; }