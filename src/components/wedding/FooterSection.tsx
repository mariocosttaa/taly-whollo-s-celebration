import { FloralDecoration } from "./FloralDecoration";

const FooterSection = () => {
  return (
    <footer className="relative bg-charcoal text-cream py-16 md:py-24 overflow-hidden">
      {/* Decorative Elements */}
      <FloralDecoration
        variant="center"
        className="opacity-10 mix-blend-overlay"
      />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <img
            src="/taly-e-whollo-logo.png"
            alt="Taly & Whollo"
            className="h-[30rem] sm:h-[36rem] md:h-[42rem] lg:h-[48rem] w-auto opacity-90 invert brightness-0 max-w-[95vw] object-contain"
          />
        </div>

        <div className="flex items-center justify-center gap-4 text-white/60 font-body tracking-[0.2em] text-sm md:text-base uppercase mb-12">
          <span>14 . 08 . 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Lisboa</span>
        </div>

        <div className="w-24 h-px bg-white/10 mx-auto mb-12" />

        <p className="font-body text-white/40 text-sm flex items-center justify-center gap-2">
          feito por bindamy.site todos os direitos reservados..
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
