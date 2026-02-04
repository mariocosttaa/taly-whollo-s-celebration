import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="relative py-16 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Names */}
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
            Taly <span className="text-primary">&</span> Whollo
          </h2>

          {/* Date */}
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8">
            14 de Agosto de 2026
          </p>

          {/* Divider */}
          <div className="divider-ornament mb-8" />

          {/* Message */}
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
            Esperamos vê-los neste dia tão especial para nós. Que o amor que sentimos um pelo outro inspire todos à nossa volta.
          </p>

          {/* Heart */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-light"
          >
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </motion.div>

          {/* Copyright */}
          <p className="mt-8 font-body text-xs text-muted-foreground/60">
            © 2026 Taly & Whollo • Feito com amor
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
