import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { FloralDecoration } from "./FloralDecoration";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;

    // Only show if at the very top of the page
    setIsVisible(currentScrollY < 20);

    setLastScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 50);
  });

  const navItems = [
    { label: "Início", href: "#" },
    { label: "Evento", href: "#countdown" },
    { label: "Galeria", href: "#gallery" },
    { label: "Detalhes", href: "#details" },
    { label: "RSVP", href: "#rsvp" },
  ];

  const scrollToSection = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md shadow-soft py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("#")}
            className={`font-heading text-xl md:text-2xl tracking-tight transition-colors ${
              isScrolled ? "text-charcoal" : "text-white md:text-white"
            }`}
          >
            TALY{" "}
            <span className={isScrolled ? "text-charcoal" : "text-white"}>
              &
            </span>{" "}
            WHOLLO
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`font-body text-xs tracking-[0.2em] uppercase transition-colors link-underline ${
                  isScrolled
                    ? "text-charcoal/80 hover:text-charcoal"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="/admin"
              className={`font-body text-xs tracking-[0.2em] uppercase transition-colors link-underline border border-white/30 px-4 py-2 rounded-full hover:bg-white/10 ${
                isScrolled
                  ? "text-charcoal/80 hover:text-charcoal border-charcoal/30 hover:bg-charcoal/5"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? "text-charcoal" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden flex flex-col items-center justify-center space-y-8"
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="font-heading text-2xl text-charcoal hover:text-stone-500 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <a
            href="/admin"
            className="font-heading text-2xl text-charcoal hover:text-stone-500 transition-colors"
          >
            Login
          </a>
        </motion.div>
      )}
    </>
  );
};

export default Navigation;
