import { useState, useRef, useEffect } from "react";
import { Volume2, Volume1, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  shouldPlay: boolean;
}

export const MusicPlayer = ({ shouldPlay }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // "Volume suave"
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const playAudio = async () => {
      if (shouldPlay && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay blocked, waiting for interaction", error);
          setIsPlaying(false);
        }
      } else if (!shouldPlay && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [shouldPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.error("Play failed", e));
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  if (!shouldPlay && !isPlaying) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: 100, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            className="bg-white/90 backdrop-blur-md rounded-full h-12 flex items-center px-4 shadow-lg border border-stone-200 overflow-hidden"
          >
            <Slider
              defaultValue={[volume]}
              max={1}
              step={0.01}
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              className="w-24 accent-primary"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isPlaying
            ? "bg-white/90 text-primary border border-primary/20 hover:scale-105"
            : "bg-white/50 text-stone-500 hover:bg-white hover:text-primary"
        }`}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : volume < 0.5 ? (
          <Volume1 className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </motion.div>
  );
};
