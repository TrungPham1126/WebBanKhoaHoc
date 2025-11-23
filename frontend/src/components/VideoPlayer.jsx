import { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Kiểm tra nếu là file HLS (.m3u8)
    if (src.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Hỗ trợ Safari
        video.src = src;
      }
    } else {
      // File MP4 thường
      video.src = src;
    }
  }, [src]);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        controls
        className="w-full h-auto max-h-[500px]"
        poster={poster}
      >
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  );
};

export default VideoPlayer;
