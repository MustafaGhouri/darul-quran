import { CheckCheck } from "lucide-react";
import AttachmentDisplay from "./AttachmentDisplay";

/**
 * Single message bubble (sent or received). WhatsApp-style layout.
 * @param {boolean} isSent
 * @param {string} text
 * @param {string} time
 * @param {object|null} attachment - { url, name, size }
 * @param {React.ReactNode} statusIcon - e.g. MessageStatusIcon for sent; omit for received
 */
export default function ChatMessageBubble({
  isSent,
  text,
  time,
  attachment,
  statusIcon,
}) {
  const showText = text && text !== "[File]";

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%] min-w-[120px]">
        <div
          className={`text-sm rounded-2xl px-3 py-2 ${
            isSent
              ? "rounded-br-md bg-teal-600 text-white"
              : "rounded-bl-md bg-white text-gray-900 shadow-sm"
          }`}
        >
          {attachment && (
            <div className="mb-2">
              <AttachmentDisplay attachment={attachment} variant={isSent ? "sent" : "received"} />
            </div>
          )}
          {showText && <p className="m-0 wrap-break-word">{text}</p>}
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <span className={`text-[11px] ${isSent ? "text-white/80" : "text-gray-400"}`}>
              {time}
            </span>
            {statusIcon != null ? statusIcon : !isSent ? <CheckCheck size={12} className="text-teal-500 shrink-0" aria-label="Received" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
