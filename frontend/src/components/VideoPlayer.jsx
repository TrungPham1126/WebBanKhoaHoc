import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
  FaRedo,
  FaUndo,
} from "react-icons/fa";

const VideoPlayer = ({ src, autoPlay = false, onEnded }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // State quản lý
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);

  // Timer ẩn controls
  const controlsTimeoutRef = useRef(null);

  // --- 1. KHỞI TẠO HLS HOẶC NATIVE VIDEO ---
  useEffect(() => {
    let hls;
    if (Hls.isSupported() && src?.endsWith(".m3u8")) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari hỗ trợ native HLS
      videoRef.current.src = src;
      if (autoPlay) videoRef.current.play();
    } else {
      // Video MP4 thường
      videoRef.current.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, autoPlay]);

  // --- 2. XỬ LÝ SỰ KIỆN VIDEO ---
  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);

    // Tính % buffer
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(
        videoRef.current.buffered.length - 1
      );
      setBuffered((bufferedEnd / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
    setShowSettings(false);
  };

  const skipTime = (seconds) => {
    videoRef.current.currentTime += seconds;
  };

  // --- 3. AUTO HIDE CONTROLS ---
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000); // Ẩn sau 3s
  };

  // Helper format thời gian (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={() => setShowSettings(false)}
    >
      {/* VIDEO ELEMENT */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        onEnded={() => {
          setIsPlaying(false);
          // 🔥 GỌI CALLBACK KHI VIDEO KẾT THÚC
          if (onEnded) onEnded();
        }}
      />

      {/* --- LAYER OVERLAY KHI PAUSE --- */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
            <FaPlay className="text-white ml-1 text-2xl" />
          </div>
        </div>
      )}

      {/* --- CONTROL BAR --- */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* THANH TIẾN TRÌNH */}
        <div className="relative w-full h-1.5 bg-gray-600 rounded cursor-pointer group/progress mb-4">
          <div
            className="absolute top-0 left-0 h-full bg-gray-400 rounded opacity-50"
            style={{ width: `${buffered}%` }}
          ></div>
          <div
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover/progress:scale-100 transition-transform"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* CÁC NÚT ĐIỀU KHIỂN */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="hover:text-indigo-400 transition"
            >
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>
            <button
              onClick={() => skipTime(-10)}
              className="hover:text-indigo-400 transition text-xs font-bold flex flex-col items-center"
            >
              <FaUndo size={12} className="mb-0.5" /> 10s
            </button>
            <button
              onClick={() => skipTime(10)}
              className="hover:text-indigo-400 transition text-xs font-bold flex flex-col items-center"
            >
              <FaRedo size={12} className="mb-0.5" /> 10s
            </button>
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="w-6"
              >
                {volume === 0 ? (
                  <FaVolumeMute size={18} />
                ) : (
                  <FaVolumeUp size={18} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-20 transition-all duration-300 h-1 bg-white rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-xs font-medium text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                className="font-bold text-sm hover:text-indigo-400 transition flex items-center gap-1"
              >
                {playbackRate}x <FaCog size={14} />
              </button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 w-32 z-50 animate-fadeIn">
                  <div className="text-xs text-gray-400 px-3 pb-2 border-b border-gray-700 mb-1">
                    Tốc độ phát
                  </div>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition ${
                        playbackRate === rate
                          ? "text-indigo-400 font-bold"
                          : "text-gray-300"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleFullScreen}
              className="hover:text-indigo-400 transition"
            >
              {isFullScreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
