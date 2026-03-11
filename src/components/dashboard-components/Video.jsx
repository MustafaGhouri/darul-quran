import { Play } from "lucide-react";
import { useRef, useState } from "react";

export default function VideoPlayer({
  src,
  poster,
  className = "",
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!videoRef.current) return;

    setIsPlaying(true);
    await videoRef.current.play();
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-t-lg ${className}`}
    >
      {src ? <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        controls={isPlaying}
        controlsList="nodownload"
        playsInline
      /> :
        <img
          src={poster}
          className="w-full h-full object-cover"
          alt="Course Thumbnail"
        />}

      {src&&!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#7ed3c5ab] shadow-lg">
            <Play className="w-6 h-6 ml-1" color="#406c65" fill="#406c65" />
          </div>
        </button>
      )}
    </div>
  );
}