import { motion, AnimatePresence } from 'framer-motion';
import { Church, Wine, PartyPopper, Heart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FloralDecoration } from './FloralDecoration';

const TimelineSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const events = [
    {
      time: '16:30',
      title: 'Cerimónia Civil',
      description: 'Início da cerimónia na Quinta do Terrim',
      details: 'A cerimónia será realizada ao ar livre, nos jardins da Quinta. Pedimos que cheguem 15 minutos antes para se acomodarem.',
      icon: Church,
    },
    {
      time: '17:30',
      title: 'Recepção de Boas-Vindas',
      description: 'Cocktail e momentos de celebração',
      details: 'Desfrutem de bebidas refrescantes e aperitivos enquanto os noivos realizam a sessão fotográfica.',
      icon: Wine,
    },
    {
      time: '20:00',
      title: 'Copo-d\'Água',
      description: 'Jantar e festa no Salão Maldini Eventos',
      details: 'Um jantar requintado seguido de muita música e dança pela noite dentro.',
      icon: PartyPopper,
    },
  ];

  const toggleEvent = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
       {/* Decorative Background */}
       <FloralDecoration variant="side-left" flowerNumber={5} className="opacity-50" />
       <FloralDecoration variant="side-right" flowerNumber={6} className="opacity-30 top-3/4" />
       
      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] text-primary uppercase mb-4">Programação</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">Cronograma do Dia</h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent transform md:-translate-x-1/2" />

          {events.map((event, index) => (
            <motion.div
              key={event.time}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`relative flex items-start mb-16 md:mb-24 cursor-pointer group ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              onClick={() => toggleEvent(index)}
            >
              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20 md:text-left'
              }`}>
                <div className={`relative p-8 bg-white/60 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
                  expandedIndex === index 
                    ? 'border-primary shadow-elegant bg-white/80' 
                    : 'border-white/50 shadow-sm hover:shadow-md'
                }`}>
                  <span className="block font-heading text-4xl md:text-5xl text-primary mb-2">
                    {event.time}
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl text-charcoal mb-3">
                    {event.title}
                  </h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                  
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-sm text-charcoal/80 italic border-t border-primary/10 pt-4">
                          {event.details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className={`mt-4 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                    <ChevronDown className={`w-5 h-5 text-primary/50 transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Center Dot */}
              <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full border-4 shadow-lg z-10 transition-all duration-300 mt-0 ${
                expandedIndex === index ? 'bg-white border-primary scale-110' : 'bg-background border-primary/20'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  expandedIndex === index ? 'bg-primary text-white' : 'bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white'
                }`}>
                   <event.icon className="w-6 h-6 transition-colors duration-300" />
                </div>
              </div>

              {/* Spacer for other side */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>

        {/* Bible Verse */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-24 max-w-3xl mx-auto text-center"
        >
          <Heart className="w-10 h-10 text-primary/40 mx-auto mb-8 animate-pulse-soft" />
          
          <blockquote className="font-heading text-xl md:text-2xl text-charcoal/80 italic leading-relaxed mb-6">
            "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor."
          </blockquote>
          <cite className="font-body text-sm text-primary tracking-widest uppercase not-italic">
            1 Coríntios 13:4-5
          </cite>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;
