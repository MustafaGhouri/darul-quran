import { CheckCheck, Check, Clock } from "lucide-react";

/**
 * Status icon for sent messages: pending, sent, delivered, read.
 */
export default function MessageStatusIcon({ msg, currentUserId }) {
  if (msg.userId !== currentUserId) return null;

  const pending = msg.pending === true;
  const delivered = msg.isDelivered === true;
  const read = msg.isRead === true;

  if (pending) {
    return <Clock size={12} className="text-white/70 shrink-0" aria-label="Sending" />;
  }
  if (read) {
    return <CheckCheck size={14} className="text-blue-200 shrink-0" aria-label="Read" />;
  }
  if (delivered) {
    return <CheckCheck size={14} className="text-white/80 shrink-0" aria-label="Delivered" />;
  }
  return <Check size={12} className="text-white/70 shrink-0" aria-label="Sent" />;
}
