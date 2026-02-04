import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const navItems = [
    { label: 'Início', href: '#' },
    { label: 'Evento', href: '#countdown' },
    { label: 'Galeria', href: '#gallery' },
    { label: 'Detalhes', href: '#details' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-soft py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('#')}
            className={`font-heading text-xl md:text-2xl tracking-tight transition-colors ${
              isScrolled ? 'text-charcoal' : 'text-cream'
            }`}
          >
            T <span className="text-primary">&</span> W
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`font-body text-xs tracking-[0.2em] uppercase transition-colors link-underline ${
                  isScrolled 
                    ? 'text-charcoal/80 hover:text-charcoal' 
                    : 'text-cream/80 hover:text-cream'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? 'text-charcoal' : 'text-cream'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : '100%',
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 md:hidden"
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
      >
        <div 
          className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-background shadow-elegant p-8 pt-24">
          <div className="flex flex-col gap-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0, 
                  x: isMobileMenuOpen ? 0 : 20 
                }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="font-body text-sm tracking-[0.2em] uppercase text-charcoal/80 hover:text-primary text-left transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navigation;
