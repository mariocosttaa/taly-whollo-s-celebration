import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { FloralDecoration } from "./FloralDecoration";

const GiftSection = () => {
  const [copied, setCopied] = useState(false);
  const IBAN = "PT50000700000084373713823";

  const handleCopyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(IBAN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section
      id="gifts"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <FloralDecoration
        variant="side-right"
        flowerNumber={2}
        className="opacity-60 -right-10"
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] text-primary uppercase mb-4">
            Presentes
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">
            Lista de Presentes
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mb-12 rounded-full" />

          <div className="bg-white/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 md:p-12 shadow-soft hover:shadow-elegant transition-all duration-500">
            <Gift className="w-12 h-12 text-primary mx-auto mb-6" />
            <p className="font-heading text-xl md:text-2xl text-charcoal mb-6 leading-relaxed">
              A vossa presença é o maior presente que nos podem dar!
            </p>
            <p className="font-body text-base text-muted-foreground mb-8 leading-relaxed">
              No entanto, se desejarem contribuir para o início da nossa vida a
              dois, podem fazê-lo através de:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-sage/10 p-6 rounded-xl border border-sage/20">
              <code className="font-mono text-sm sm:text-lg text-charcoal bg-white px-4 py-3 rounded border border-sage/10 tracking-wider break-all">
                {IBAN}
              </code>
              <button
                onClick={handleCopyIBAN}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftSection;
