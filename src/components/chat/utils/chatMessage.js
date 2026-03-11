/**
 * Parses attachment from a message (API returns file as JSON string).
 * @param {object} msg - Message object with optional .file or .attachment
 * @returns {{ attachment: object|null, hasAttachment: boolean }}
 */
export function parseMessageAttachment(msg) {
  const attachment =
    msg.attachment ||
    (() => {
      try {
        if (msg.file && typeof msg.file === "string") return JSON.parse(msg.file);
      } catch {
        return null;
      }
      return null;
    })();
  return {
    attachment: attachment || null,
    hasAttachment: !!msg.hasAttachment || !!attachment,
  };
}

/**
 * Format file size for display.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes == null || bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get date key (YYYY-MM-DD) for a message for grouping.
 * @param {string|Date} createdAt
 * @returns {string}
 */
export function getMessageDateKey(createdAt) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  return d.toISOString().slice(0, 10);
}

/**
 * Format date for WhatsApp-style separator: "Today", "Yesterday", or "Feb 27, 2025".
 * @param {string|Date} createdAt
 * @returns {string}
 */
export function formatDateSeparator(createdAt) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayKey = today.toISOString().slice(0, 10);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const key = d.toISOString().slice(0, 10);
  if (key === todayKey) return "Today";
  if (key === yesterdayKey) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
