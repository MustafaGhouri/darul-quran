import { Fullscreen } from "lucide-react";
import { useRef, useState } from "react";



export default function LessonFileViewer({
  file,
  autoPlay,
  onEnded,
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mimeType =
    file.file?.mimetype || file.fileType || "";

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const fileUrl = `${file.url}?raw=1`;

  const renderContent = () => {
    if (mimeType.startsWith("video/")) {
      return (
        <video
          src={fileUrl}
          controls
          autoPlay={autoPlay}
          className="w-full h-full"
          controlsList="nodownload"
          poster={file.thumbnailUrl || undefined}
          onEnded={onEnded}
        />
      );
    }

    if (mimeType.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          className="w-full h-full object-contain"
        />
      );
    }

    if (mimeType === "application/pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full"
        />
      );
    }

    if (
      mimeType.includes("word") ||
      mimeType.includes("officedocument")
    ) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            fileUrl
          )}&embedded=true`}
          className="w-full h-full"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <a
          href={fileUrl}
          target="_blank"
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Open in new tab
        </a>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black"
    >
      {file.fileType !== 'lesson_video' &&
       <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        className="absolute cursor-pointer hover:opacity-55 top-12 right-4 z-50 bg-black/60 text-white px-3 py-1 rounded-md text-sm"
      >

         <Fullscreen/> 
      </button>}

      {renderContent()}
    </div>
  );
}
