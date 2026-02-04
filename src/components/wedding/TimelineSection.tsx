import { motion } from 'framer-motion';
import { Church, Wine, PartyPopper, Heart } from 'lucide-react';

const TimelineSection = () => {
  const events = [
    {
      time: '16:30',
      title: 'Cerimónia Civil',
      description: 'Início da cerimónia na Quinta do Terrim',
      icon: Church,
    },
    {
      time: '17:30',
      title: 'Recepção de Boas-Vindas',
      description: 'Cocktail e momentos de celebração',
      icon: Wine,
    },
    {
      time: '20:00',
      title: 'Copo-d\'Água',
      description: 'Jantar e festa no Salão Maldini Eventos',
      icon: PartyPopper,
    },
  ];

  const verse = {
    text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor. O amor não se alegra com a injustiça, mas se alegra com a verdade. Tudo sofre, tudo crê, tudo espera, tudo suporta.",
    reference: "1 Coríntios 13:4-7"
  };

  return (
    <section className="relative section-padding bg-sage-light overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle mb-4">Programação</p>
          <h2 className="section-title mb-4">Cronograma do Dia</h2>
          <div className="divider-ornament" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent transform md:-translate-x-1/2" />

          {events.map((event, index) => (
            <motion.div
              key={event.time}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`relative flex items-center mb-12 md:mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'
              }`}>
                <div className="card-elegant inline-block">
                  <span className="font-heading text-4xl md:text-5xl font-medium text-primary">
                    {event.time}
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl text-charcoal mt-2 mb-2">
                    {event.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-background border-4 border-primary shadow-elegant z-10">
                <event.icon className="w-6 h-6 text-primary" />
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
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <Heart className="w-8 h-8 text-primary mx-auto mb-6 animate-pulse-soft" />
          
          <blockquote className="font-heading text-lg md:text-xl text-charcoal/80 italic leading-relaxed mb-6">
            "{verse.text}"
          </blockquote>
          
          <cite className="font-body text-sm tracking-wider text-primary not-italic">
            — {verse.reference}
          </cite>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;
