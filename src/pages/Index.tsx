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
  return (
    <div className="relative">
      <Navigation />
      <main>
        <HeroSection />
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
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
