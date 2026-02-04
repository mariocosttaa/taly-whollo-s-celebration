import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownSection = () => {
  const weddingDate = new Date('2026-08-14T16:30:00');
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = weddingDate.getTime() - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Minutos' },
    { value: timeLeft.seconds, label: 'Segundos' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="countdown" className="relative section-padding bg-background overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-subtitle mb-4">Save the Date</p>
          <h2 className="section-title mb-4">Contagem Regressiva</h2>
          <div className="divider-ornament mb-12" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              variants={itemVariants}
              className="relative"
            >
              <div className="card-elegant py-8 md:py-12">
                <motion.span
                  key={unit.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-charcoal"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
                <span className="block mt-3 font-body text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                  {unit.label}
                </span>
              </div>

              {/* Separator dots (except last) */}
              {index < timeUnits.length - 1 && (
                <div className="hidden md:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 flex-col gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse-soft" />
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 font-heading text-lg md:text-xl text-muted-foreground italic"
        >
          "O amor é paciente, o amor é bondoso..."
        </motion.p>
      </div>
    </section>
  );
};

export default CountdownSection;
