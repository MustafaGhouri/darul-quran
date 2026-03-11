import { useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import AttachmentPreview from "./AttachmentPreview";

/**
 * Chat input with image/video attachment.
 * attachedAttachment: null | { file?, url?, name?, size?, type?, uploading? }
 * Send is enabled when there is text or a ready (uploaded) attachment.
 */
export default function ChatInput({
  message,
  onMessageChange,
  attachedAttachment,
  onFileSelect,
  onRemoveAttachment,
  onSend,
  sending,
  disabled,
  onInvalidFile,
}) {
  const fileInputRef = useRef(null);

  const hasReadyAttachment = attachedAttachment && "url" in attachedAttachment && !attachedAttachment.uploading;
  const canSend = !disabled && (message.trim() || hasReadyAttachment);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (isImage || isVideo) {
      onFileSelect(file);
    } else {
      onInvalidFile?.();
    }
  };

  return (
    <div className="border-t border-gray-200 px-3 py-2 shrink-0 bg-[#d2ebe5]">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      {attachedAttachment && (
        <div className="mb-2">
          <AttachmentPreview
            attachment={attachedAttachment}
            onRemove={onRemoveAttachment}
          />
        </div>
      )}
      <div className="flex items-center gap-2 bg-white rounded-2xl pl-4 pr-2 py-1.5 shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Attach file"
        >
          <Paperclip size={22} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
          placeholder="Message"
          className="flex-1 min-w-0 py-2 text-sm bg-transparent border-none outline-none placeholder-gray-400"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend || sending}
          className="shrink-0 p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Send"
        >
          <Send size={20} className="-rotate-45" />
        </button>
      </div>
    </div>
  );
}
