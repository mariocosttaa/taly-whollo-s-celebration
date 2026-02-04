import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeroSectionProps {
  onVideoComplete: () => void;
  isVideoPhase: boolean;
}

const HeroSection = ({ onVideoComplete, isVideoPhase }: HeroSectionProps) => {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [canSkip, setCanSkip] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Countdown timer for 1 minute lock
  useEffect(() => {
    if (!isVideoPhase) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Allow skip after 5 seconds (small button appears)
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
    };
  }, [isVideoPhase]);

  // Auto-complete after 60 seconds
  useEffect(() => {
    if (timeRemaining === 0 && isVideoPhase) {
      handleSkipVideo();
    }
  }, [timeRemaining, isVideoPhase]);

  const handleSkipVideo = () => {
    setShowContent(true);
    setTimeout(() => {
      onVideoComplete();
    }, 500);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Post message to YouTube iframe to toggle mute
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: isMuted ? 'unMute' : 'mute',
        }),
        '*'
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
      <AnimatePresence>
        {isVideoPhase && !showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10"
          >
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                ref={playerRef}
                className="absolute"
                src={`https://www.youtube.com/embed/V3z8Gy92-_Q?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=V3z8Gy92-_Q&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1&playsinline=1&start=0`}
                title="Wedding Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '177.78vh',
                  height: '100vh',
                  minWidth: '100%',
                  minHeight: '56.25vw',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Subtle gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Video Controls - Bottom left */}
            <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
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

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <span className="font-body text-sm text-white/80 tracking-wider">
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </span>
              </motion.div>
            </div>

            {/* Skip Button - Bottom right */}
            <AnimatePresence>
              {canSkip && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleSkipVideo}
                  className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
                >
                  <span className="font-body text-sm tracking-wider">Pular</span>
                  <SkipForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Couple Names - Elegant overlay on video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center z-20"
            >
              <p className="font-heading text-2xl md:text-3xl text-white/90 tracking-widest">
                T <span className="text-primary">&</span> W
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal" />

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 border border-primary/30 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 2, delay: 0.7 }}
              className="absolute bottom-20 right-10 w-24 h-24 md:w-36 md:h-36 border border-primary/30 rounded-full"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Pre-title */}
                <motion.p
                  variants={fadeUpVariants}
                  className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-primary/80"
                >
                  Vamos Celebrar o nosso Amor
                </motion.p>

                {/* Main Title - Names */}
                <div className="overflow-hidden">
                  <motion.div className="flex flex-col items-center gap-2 md:gap-4">
                    {/* TALY */}
                    <div className="overflow-hidden">
                      <motion.div className="flex justify-center">
                        {name1.split('').map((letter, index) => (
                          <motion.span
                            key={`name1-${index}`}
                            variants={letterVariants}
                            className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium text-cream tracking-tight"
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>

                    {/* Ampersand */}
                    <motion.span
                      variants={fadeUpVariants}
                      className="font-heading text-3xl md:text-5xl text-primary italic"
                    >
                      &
                    </motion.span>

                    {/* WHOLLO */}
                    <div className="overflow-hidden">
                      <motion.div className="flex justify-center">
                        {name2.split('').map((letter, index) => (
                          <motion.span
                            key={`name2-${index}`}
                            variants={letterVariants}
                            className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium text-cream tracking-tight"
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Date */}
                <motion.div
                  variants={fadeUpVariants}
                  className="pt-6"
                >
                  <p className="font-heading text-2xl md:text-4xl text-cream/90 tracking-wider">
                    14 . 08 . 2026
                  </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                  variants={fadeUpVariants}
                  className="divider-ornament opacity-50"
                />

                {/* Location */}
                <motion.p
                  variants={fadeUpVariants}
                  className="font-body text-xs md:text-sm tracking-[0.3em] uppercase text-cream/60"
                >
                  Pinhal Novo & Montijo, Portugal
                </motion.p>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/50">
                    Scroll
                  </span>
                  <ChevronDown className="w-5 h-5 text-cream/50" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
