import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { useState, useRef } from 'react';

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayVideo = () => {
    setShowVideo(true);
    setIsVideoPlaying(true);
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
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      {/* Video Background */}
      {showVideo ? (
        <div className="absolute inset-0">
          <iframe
            className="absolute w-full h-full object-cover scale-150"
            src="https://www.youtube.com/embed/V3z8Gy92-_Q?autoplay=1&mute=1&loop=1&playlist=V3z8Gy92-_Q&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1&playsinline=1"
            title="Wedding Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ 
              pointerEvents: 'none',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '177.78vh',
              height: '100vh',
              minWidth: '100%',
              minHeight: '56.25vw',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal" />
      )}

      {/* Overlay */}
      <div className="video-overlay" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 border border-primary/30 rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 1.2 }}
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

          {/* Play Button */}
          {!showVideo && (
            <motion.button
              variants={fadeUpVariants}
              onClick={handlePlayVideo}
              className="group mt-8 flex items-center gap-3 mx-auto px-6 py-3 border border-cream/30 rounded-full hover:border-primary hover:bg-primary/10 transition-all duration-500"
            >
              <Play className="w-4 h-4 text-cream group-hover:text-primary transition-colors" />
              <span className="font-body text-xs tracking-widest uppercase text-cream group-hover:text-primary transition-colors">
                Ver Vídeo
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
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
    </section>
  );
};

export default HeroSection;
