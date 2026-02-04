import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/wedding/Navigation';
import HeroSection from '@/components/wedding/HeroSection';
import CountdownSection from '@/components/wedding/CountdownSection';
import GallerySection from '@/components/wedding/GallerySection';
import DetailsSection from '@/components/wedding/DetailsSection';
import TimelineSection from '@/components/wedding/TimelineSection';
import FAQSection from '@/components/wedding/FAQSection';
import RSVPSection from '@/components/wedding/RSVPSection';
import FooterSection from '@/components/wedding/FooterSection';

const Index = () => {
  const [isVideoPhase, setIsVideoPhase] = useState(true);
  const [scrollLocked, setScrollLocked] = useState(true);

  // Lock scroll during video phase
  useEffect(() => {
    if (scrollLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [scrollLocked]);

  const handleVideoComplete = () => {
    setIsVideoPhase(false);
    setScrollLocked(false);
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
        <HeroSection 
          onVideoComplete={handleVideoComplete} 
          isVideoPhase={isVideoPhase} 
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
              <div id="gallery">
                <GallerySection />
              </div>
              <div id="details">
                <DetailsSection />
              </div>
              <TimelineSection />
              <FAQSection />
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
