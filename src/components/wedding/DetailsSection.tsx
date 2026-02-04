import { motion } from 'framer-motion';
import { Church, UtensilsCrossed, MapPin, Clock, AlertCircle } from 'lucide-react';

const DetailsSection = () => {
  const events = [
    {
      icon: Church,
      title: 'Cerimónia Civil',
      time: '16:30h',
      venue: 'Quinta do Terrim',
      location: 'Pinhal Novo',
      mapUrl: 'https://maps.google.com/?q=Quinta+do+Terrim+Pinhal+Novo',
      description: 'Uma cerimónia íntima rodeada de natureza',
    },
    {
      icon: UtensilsCrossed,
      title: 'Copo-d\'Água',
      time: '20:00h',
      venue: 'Salão Maldini Eventos',
      location: 'Montijo',
      mapUrl: 'https://maps.google.com/?q=Salao+Maldini+Eventos+Montijo',
      description: 'Celebração com jantar, música e dança',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="relative section-padding bg-background overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 border border-primary/10 rounded-full" />
      <div className="absolute bottom-20 left-10 w-48 h-48 border border-primary/10 rounded-full" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle mb-4">O Grande Dia</p>
          <h2 className="section-title mb-4">Detalhes do Evento</h2>
          <div className="divider-ornament" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="card-elegant group relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-light mb-6 group-hover:scale-110 transition-transform duration-500">
                  <event.icon className="w-7 h-7 text-sage-dark" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl md:text-3xl text-charcoal mb-4">
                  {event.title}
                </h3>

                {/* Time */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-heading text-3xl text-primary font-medium">
                    {event.time}
                  </span>
                </div>

                {/* Venue */}
                <div className="space-y-1 mb-6">
                  <p className="font-body text-lg font-medium text-charcoal">
                    {event.venue}
                  </p>
                  <p className="font-body text-muted-foreground">
                    {event.location}
                  </p>
                </div>

                {/* Description */}
                <p className="font-body text-sm text-muted-foreground mb-6 italic">
                  {event.description}
                </p>

                {/* Map Button */}
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 rounded-full text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <MapPin className="w-4 h-4" />
                  Ver no Mapa
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-3 p-4 bg-accent/50 rounded-lg border border-primary/20"
        >
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="font-body text-sm text-charcoal">
            <strong>Nota importante:</strong> A cerimónia e o copo-d'água serão em locais diferentes.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DetailsSection;
