import { motion } from "framer-motion";
import {
  Church,
  UtensilsCrossed,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import { FloralDecoration } from "./FloralDecoration";

const DetailsSection = () => {
  const events = [
    {
      icon: Church,
      title: "Cerimónia Civil",
      time: "16:30h",
      venue: "Quinta do Terrim",
      location: "Travessa D. João IV 4, 2955-143 Pinhal Novo",
      mapUrl: "https://maps.app.goo.gl/RF1r7k6hfCxqX5JCA",
      description: "Uma cerimónia íntima rodeada de natureza",
    },
    {
      icon: UtensilsCrossed,
      title: "Copo-d'Água",
      time: "20:00h",
      venue: "Salão Maldini Eventos",
      location: "Montijo",
      mapUrl: "https://maps.google.com/?q=Salao+Maldini+Eventos+Montijo",
      description: "Celebração com jantar, música e dança",
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
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Decorative Elements */}
      <FloralDecoration
        variant="top-right"
        flowerNumber={3}
        className="opacity-80 translate-x-0 translate-y-0"
      />
      <FloralDecoration
        variant="bottom-left"
        flowerNumber={1}
        className="opacity-80 translate-x-4 -translate-y-4"
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] text-primary uppercase mb-4">
            O Grande Dia
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">
            Detalhes do Evento
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
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
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl shadow-soft transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-elegant border border-white/50" />

              <div className="relative p-8 md:p-12 text-center h-full flex flex-col items-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                  <event.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-3xl text-charcoal mb-6">
                  {event.title}
                </h3>

                {/* Time */}
                <div className="flex items-center gap-2 mb-8 bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-heading text-2xl text-primary">
                    {event.time}
                  </span>
                </div>

                {/* Venue */}
                <div className="mb-8 flex-grow">
                  <p className="font-body text-xl font-medium text-charcoal mb-2">
                    {event.venue}
                  </p>
                  <p className="font-body text-muted-foreground flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </p>
                  <p className="font-body text-sm text-muted-foreground/80 mt-4 italic">
                    {event.description}
                  </p>
                </div>

                {/* Button */}
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-medium border-b border-primary/30 hover:border-primary transition-colors pb-1 group/btn"
                >
                  Ver no Mapa
                  <ExternalLink className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
