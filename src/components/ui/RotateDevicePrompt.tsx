import { motion, AnimatePresence } from "framer-motion";
import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "horizontal_prompt_seen";

export const RotateDevicePrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Only show prompt on first visit (per device). After first time, go straight to site.
    const alreadySeen = localStorage.getItem(STORAGE_KEY) === "1";

    const checkOrientation = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;

      if (alreadySeen) {
        setIsVisible(false);
        return;
      }
      if (isMobile && isPortrait) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkOrientation();

    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, "1");
      }
    };

    mediaQuery.addEventListener("change", handleOrientationChange);
    return () => mediaQuery.removeEventListener("change", handleOrientationChange);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsVisible(false);
            localStorage.setItem(STORAGE_KEY, "1");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVisible, countdown]);

  return (
    <AnimatePresence>
      {isVisible && countdown > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 90 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <Smartphone className="w-20 h-20 text-white/80" />
          </motion.div>
          
          <h3 className="font-heading text-2xl text-white mb-4 tracking-wider">
            Melhor Experiência
          </h3>
          
          <p className="font-body text-white/70 text-lg mb-8 max-w-xs">
            Por favor, vire o seu dispositivo para a horizontal para aproveitar melhor o vídeo.
          </p>

          <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-white/10"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-white transition-all duration-1000 ease-linear"
                strokeDasharray={176}
                strokeDashoffset={176 - (176 * countdown) / 10}
              />
            </svg>
            <span className="text-white font-mono text-sm">{countdown}s</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
