import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FloralDecoration } from "./FloralDecoration";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownSection = () => {
  const weddingDate = new Date("2026-08-14T16:30:00");

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
    { value: timeLeft.days, label: "Dias" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Minutos" },
    { value: timeLeft.seconds, label: "Segundos" },
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
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="countdown"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Decorative Background */}
      <FloralDecoration 
        variant="top-left" 
        flowerNumber={1} 
        className="translate-x-0 translate-y-0 opacity-80"
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] text-primary uppercase mb-4">
            Save the Date
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">
            Contagem Regressiva
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mb-16 rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {timeUnits.map((unit) => (
            <motion.div
              key={unit.label}
              variants={itemVariants}
              className="relative group"
            >
              <div className="relative p-6 md:p-8 bg-white/50 backdrop-blur-sm border border-primary/10 rounded-2xl shadow-soft group-hover:shadow-elegant transition-all duration-500 transform group-hover:-translate-y-2">
                <span className="block font-heading text-5xl md:text-6xl lg:text-7xl text-primary mb-2">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="block font-body text-sm md:text-base text-charcoal/70 uppercase tracking-widest">
                  {unit.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;
