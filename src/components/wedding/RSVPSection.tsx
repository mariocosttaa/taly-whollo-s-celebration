import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, Check, Loader2, Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RSVPSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    guests: '1',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Confirmação Recebida! 💕",
      description: "Obrigado por confirmar a sua presença. Mal podemos esperar para celebrar convosco!",
    });
  };

  const inputClasses = "w-full px-4 py-4 bg-background border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300";

  return (
    <section className="relative section-padding bg-charcoal overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cream rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-cream rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cream rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-primary mb-4">
            Confirme a Sua Presença
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-cream tracking-tight mb-4">
            RSVP
          </h2>
          <div className="divider-ornament opacity-50 mb-6" />
          <p className="font-body text-cream/70 max-w-md mx-auto">
            Por favor confirme a sua presença até <strong className="text-primary">15 de Julho de 2026</strong>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm text-cream/80 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="O seu nome"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cream/80 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm text-cream/80 mb-2">
                    Confirmação *
                  </label>
                  <select
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="yes">Sim, estarei presente! 🎉</option>
                    <option value="no">Infelizmente não poderei ir 😢</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-sm text-cream/80 mb-2">
                    Número de Convidados
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="1">1 pessoa</option>
                    <option value="2">2 pessoas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-body text-sm text-cream/80 mb-2">
                  Mensagem para os Noivos
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Deixe uma mensagem especial para os noivos..."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-wedding flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A Enviar...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Confirmar Presença
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6"
              >
                <Check className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: -20, 
                      x: Math.random() * window.innerWidth,
                      opacity: 1,
                      scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                      y: window.innerHeight + 20,
                      rotate: Math.random() * 360,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: Math.random() * 2 + 2,
                      delay: Math.random() * 0.5,
                      ease: "linear"
                    }}
                    className="absolute"
                  >
                    {i % 3 === 0 ? (
                      <Heart className="w-4 h-4 text-primary" />
                    ) : i % 3 === 1 ? (
                      <Sparkles className="w-4 h-4 text-gold" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-sage" />
                    )}
                  </motion.div>
                ))}
              </div>

              <h3 className="font-heading text-3xl text-cream mb-4">
                Obrigado! 💕
              </h3>
              <p className="font-body text-cream/70 max-w-md mx-auto">
                A sua confirmação foi recebida com sucesso. Mal podemos esperar para celebrar este dia especial convosco!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RSVPSection;
