import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/wedding/Navigation";
import HeroSection from "@/components/wedding/HeroSection";
import CountdownSection from "@/components/wedding/CountdownSection";
import GallerySection from "@/components/wedding/GallerySection";
import DetailsSection from "@/components/wedding/DetailsSection";
import TimelineSection from "@/components/wedding/TimelineSection";
import FAQSection from "@/components/wedding/FAQSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import FooterSection from "@/components/wedding/FooterSection";
import GiftSection from "@/components/wedding/GiftSection";
import SurpriseSection from "@/components/wedding/SurpriseSection";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";

const Index = () => {
  const [isVideoPhase, setIsVideoPhase] = useState(() => {
    const watched = localStorage.getItem("introVideoWatched");
    return watched !== "true";
  });
  const [scrollLocked, setScrollLocked] = useState(() => {
    const watched = localStorage.getItem("introVideoWatched");
    return watched !== "true";
  });
  const [showGallery, setShowGallery] = useState(false);

  // Lock scroll during video phase
  useEffect(() => {
    if (scrollLocked) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [scrollLocked]);

  const handleVideoComplete = () => {
    localStorage.setItem("introVideoWatched", "true");
    setIsVideoPhase(false);
    setScrollLocked(false);

    // Auto-scroll to the next section (Countdown)
    setTimeout(() => {
      const countdownSection = document.getElementById("countdown");
      if (countdownSection) {
        countdownSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  const handleVideoRestart = () => {
    setIsVideoPhase(true);
    setScrollLocked(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRevealGallery = () => {
    setShowGallery(true);
  };

  return (
    <div className="relative">
      {/* Navigation - only shows after video phase */}
      <AnimatePresence>
        {!isVideoPhase && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Navigation />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <MusicPlayer shouldPlay={!isVideoPhase} />
        <HeroSection
          onVideoComplete={handleVideoComplete}
          isVideoPhase={isVideoPhase}
          onRestart={handleVideoRestart}
        />

        {/* Rest of content - only visible after video phase */}
        <AnimatePresence>
          {!isVideoPhase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div id="countdown">
                <CountdownSection />
              </div>
              <div id="details">
                <DetailsSection />
              </div>
              <TimelineSection />
              <GiftSection />
              <FAQSection />
              <SurpriseSection onReveal={handleRevealGallery} />

              <AnimatePresence>
                {showGallery && (
                  <motion.div
                    id="gallery-reveal"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 1 }}
                    className="overflow-hidden"
                  >
                    <div id="gallery">
                      <GallerySection />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div id="rsvp">
                <RSVPSection />
              </div>
              <FooterSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
