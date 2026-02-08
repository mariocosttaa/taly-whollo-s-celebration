import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState } from "react";
import coupleImage from "@/assets/couple-sunset.jpg";
import { FloralDecoration } from "./FloralDecoration";

interface SurpriseSectionProps {
  onReveal: () => void;
}

const SurpriseSection = ({ onReveal }: SurpriseSectionProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    onReveal();
    // Scroll to gallery after a delay
    setTimeout(() => {
      const galleryElement = document.getElementById("gallery-reveal");
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <section className="relative py-24 md:py-32 min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={coupleImage}
          alt="Couple"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-8 text-white drop-shadow-lg">
            Temos uma surpresa para vocês
          </h2>

          <motion.div
            className="cursor-pointer inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="relative w-32 h-32 md:w-48 md:h-48 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/50 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-colors"
            >
              {!isOpened ? (
                <Gift className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-lg" />
              ) : (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white font-heading text-xl"
                >
                  ❤️
                </motion.div>
              )}
            </motion.div>
            <p className="mt-6 font-body text-lg tracking-widest uppercase text-white/80">
              {isOpened ? "Surpresa Revelada!" : "Clique para abrir"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SurpriseSection;
