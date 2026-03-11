import { FileText, Download } from "lucide-react";

/**
 * Renders an image, video, or file attachment inside a message bubble.
 * Images and videos show inline preview; other files show a document card.
 * @param {{ url?: string, name?: string, size?: string, type?: 'image'|'video'|'file' }} attachment
 * @param {"sent"|"received"} variant
 */
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(\?|$)/i;

function getAttachmentType(attachment) {
  if (attachment.type) return attachment.type;
  if (attachment.mimeType?.startsWith("image/")) return "image";
  if (attachment.mimeType?.startsWith("video/")) return "video";
  const url = (attachment.url || "").toLowerCase();
  if (IMAGE_EXT.test(url)) return "image";
  if (VIDEO_EXT.test(url)) return "video";
  return "file";
}

export default function AttachmentDisplay({ attachment, variant = "received" }) {
  if (!attachment) return null;

  const isSent = variant === "sent";
  const type = getAttachmentType(attachment);

  // Image: inline preview
  if (type === "image" && attachment.url) {
    return (
      <div className="rounded-xl overflow-hidden max-w-[280px]">
        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={attachment.url}
            alt={attachment.name || "Image"}
            className="block w-full max-h-64 object-cover rounded-xl"
          />
        </a>
        {attachment.name && (
          <p className={`text-[11px] mt-1 truncate ${isSent ? "text-white/80" : "text-gray-500"}`}>
            {attachment.name}
          </p>
        )}
      </div>
    );
  }

  // Video: inline preview with controls
  if (type === "video" && attachment.url) {
    return (
      <div className="rounded-xl overflow-hidden max-w-[280px]">
        <video
          src={attachment.url}
          controls
          className="block w-full max-h-64 rounded-xl bg-black"
          preload="metadata"
          playsInline
        />
        {attachment.name && (
          <p className={`text-[11px] mt-1 truncate ${isSent ? "text-white/80" : "text-gray-500"}`}>
            {attachment.name}
          </p>
        )}
      </div>
    );
  }

  // Fallback: document card (e.g. old messages without type)
  const linkClass = isSent ? "text-teal-100 hover:text-white" : "text-teal-700 hover:text-teal-800";
  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-2.5 ${
        isSent ? "bg-white/10" : "bg-gray-100"
      }`}
    >
      <div
        className={`flex shrink-0 w-10 h-10 rounded-lg items-center justify-center ${
          isSent ? "bg-white/20" : "bg-teal-50"
        }`}
      >
        <FileText size={22} className={isSent ? "text-white" : "text-teal-600"} />
      </div>
      <div className="flex-1 min-w-0">
        {attachment.url ? (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium truncate block ${linkClass}`}
          >
            {attachment.name || "Document"}
          </a>
        ) : (
          <span className={`text-sm font-medium truncate block ${isSent ? "text-white" : "text-gray-900"}`}>
            {attachment.name || "Document"}
          </span>
        )}
        {attachment.size && (
          <p className={`text-xs mt-0.5 ${isSent ? "text-white/80" : "text-gray-500"}`}>
            {attachment.size}
          </p>
        )}
      </div>
      {attachment.url && (
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 p-1.5 rounded-full ${isSent ? "hover:bg-white/20" : "hover:bg-teal-100"}`}
          aria-label="Open file"
        >
          <Download size={18} className={isSent ? "text-white" : "text-teal-600"} />
        </a>
      )}
    </div>
  );
}
