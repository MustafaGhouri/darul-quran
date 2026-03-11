import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Spinner } from "@heroui/react";

/**
 * Preview of selected image or video before sending.
 * Supports: (1) file (File) while uploading, (2) uploaded { url, name, size, type } when ready.
 * @param {{ file?: File, url?: string, name?: string, size?: string, type?: string, uploading?: boolean }} attachment
 * @param {() => void} onRemove
 */
export default function AttachmentPreview({ attachment, onRemove }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const file = attachment?.file;
  const hasUrl = !!attachment?.url;
  const uploading = !!attachment?.uploading;

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!attachment) return null;

  const isImage = file ? file.type.startsWith("image/") : attachment.type === "image";
  const isVideo = file ? file.type.startsWith("video/") : attachment.type === "video";
  const previewUrl = hasUrl ? attachment.url : objectUrl;
  const name = attachment.name || file?.name || "";
  const sizeStr = attachment.size || (file?.size != null ? (file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`) : "");

  return (
    <div className="relative inline-block rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm max-w-[220px]">
      <div className="relative">
        {isImage && previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="block max-h-40 w-full object-cover rounded-xl"
          />
        )}
        {isVideo && previewUrl && (
          <video
            src={previewUrl}
            className="block max-h-40 w-full object-cover rounded-xl"
            muted
            playsInline
            preload="metadata"
          />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
            <Spinner size="sm" color="white" />
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Remove"
        >
          <X size={16} />
        </button>
      </div>
      <div className="px-2 py-1.5 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-700 truncate">{name}</p>
        {sizeStr && <p className="text-[10px] text-gray-500">{sizeStr}</p>}
      </div>
    </div>
  );
}
