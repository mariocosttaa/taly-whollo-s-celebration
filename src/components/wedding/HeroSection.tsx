import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  SkipForward,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import coupleRomantic from "@/assets/couple-romantic.jpg";
// FloralDecoration removed as requested

interface HeroSectionProps {
  onVideoComplete: () => void;
  isVideoPhase: boolean;
  onRestart?: () => void;
}

const HeroSection = ({
  onVideoComplete,
  isVideoPhase,
  onRestart,
}: HeroSectionProps) => {
  const [canSkip, setCanSkip] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for better autoplay support
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Handle YouTube API messages and reset state
  useEffect(() => {
    if (!isVideoPhase) return;

    // Reset state for new video phase
    setShowContent(false);
    setCanSkip(false);
    setIsPlaying(true);

    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.source === playerRef.current?.contentWindow) {
          const data = JSON.parse(event.data);

          // YouTube Player State: 0 = ended, 1 = playing, 2 = paused
          if (data.event === "onStateChange") {
            if (data.info === 0) handleSkipVideo();
            if (data.info === 1) setIsPlaying(true);
            if (data.info === 2) setIsPlaying(false);
          }
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);

    // Allow skip after 3 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(skipTimer);
    };
  }, [isVideoPhase]);

  const handleSkipVideo = () => {
    setShowContent(true);
    setTimeout(() => {
      onVideoComplete();
    }, 800); // Slightly longer delay for smoother transition
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    // Post message to YouTube iframe to toggle mute
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "unMute" : "mute",
        }),
        "*",
      );
    }
  };

  const togglePlay = () => {
    const newStatus = !isPlaying;
    setIsPlaying(newStatus);

    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: newStatus ? "playVideo" : "pauseVideo",
        }),
        "*",
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const name1 = "TALY";
  const name2 = "WHOLLO";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* YouTube Video Background - Always visible during video phase */}
      <AnimatePresence mode="wait">
        {isVideoPhase && !showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
            onClick={togglePlay} // Clicking anywhere toggles play/pause
          >
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                ref={playerRef}
                className="absolute"
                src={`https://www.youtube.com/embed/V3z8Gy92-_Q?autoplay=1&mute=1&loop=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1&playsinline=1&start=0`}
                title="Wedding Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "177.78vh",
                  height: "100vh",
                  minWidth: "100%",
                  minHeight: "56.25vw",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Subtle gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Center Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.2 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl"
                  >
                    <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Video Controls - Bottom left */}
            <div
              className="absolute bottom-8 left-8 z-20 flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Play/Pause Button (Small) */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={togglePlay}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </motion.button>

              {/* Mute/Unmute Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={toggleMute}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Skip Button - Bottom right */}
            <AnimatePresence>
              {canSkip && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkipVideo();
                  }}
                  className="absolute bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
                >
                  <span className="font-body text-sm tracking-wider">
                    Pular
                  </span>
                  <SkipForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Couple Names - Elegant overlay on video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center z-20 pointer-events-none w-full px-4"
            >
              <p className="font-heading text-xl md:text-2xl text-white/90 tracking-widest whitespace-nowrap">
                TALY <span className="text-white">&</span> WHOLLO
              </p>
              <p className="font-body text-xs tracking-[0.4em] uppercase text-white/60 mt-2">
                14.08.2026
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero Content - Shows after video */}
      <AnimatePresence>
        {(!isVideoPhase || showContent) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={coupleRomantic}
                alt="Background"
                className="w-full h-full object-cover object-[75%_center] md:object-center opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 drop-shadow-xl flex flex-col items-center"
              >
                {/* Logo Image */}
                <motion.div
                  variants={fadeUpVariants}
                  className="mb-4 w-full flex justify-center"
                >
                  <img
                    src="/taly-e-whollo-logo.png"
                    alt="Taly & Whollo"
                    className="h-[30rem] sm:h-[36rem] md:h-[42rem] lg:h-[48rem] w-auto object-contain invert brightness-0 opacity-90 max-w-[95vw] drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>

              {/* Bottom Controls */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 z-20 w-full max-w-md px-4">
                {/* Watch Again Button */}
                {onRestart && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <button
                      onClick={onRestart}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 group-hover:scale-110 transition-transform fill-current" />
                      <span className="text-xs font-heading tracking-[0.2em] uppercase">
                        Ver Vídeo
                      </span>
                    </button>
                  </motion.div>
                )}

                {/* Scroll Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      document
                        .getElementById("countdown")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                      Scroll
                    </span>
                    <ChevronDown className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
