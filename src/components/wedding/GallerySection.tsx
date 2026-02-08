import { motion } from 'framer-motion';
import { FloralDecoration } from './FloralDecoration';
import coupleHelicopter from '@/assets/couple-helicopter.jpg';
import coupleEmbrace from '@/assets/couple-embrace.jpg';
import coupleWalking from '@/assets/couple-walking.jpg';
import coupleFashion from '@/assets/couple-fashion.jpg';
import coupleKiss from '@/assets/couple-kiss-helicopter.jpg';
import coupleHelipad from '@/assets/couple-helipad.jpg';
import coupleSunset from '@/assets/couple-sunset.jpg';
import coupleRomantic from '@/assets/couple-romantic.jpg';

const GallerySection = () => {
  const images = [
    { src: coupleHelicopter, alt: 'Casal elegante junto ao helicóptero', span: 'col-span-1 md:col-span-1 row-span-2' },
    { src: coupleEmbrace, alt: 'Abraço romântico', span: 'col-span-1 md:col-span-1 row-span-1' },
    { src: coupleFashion, alt: 'Casal estiloso', span: 'col-span-1 md:col-span-1 row-span-1' },
    { src: coupleKiss, alt: 'Beijo apaixonado', span: 'col-span-1 md:col-span-1 row-span-2' },
    { src: coupleWalking, alt: 'Caminhada de mãos dadas', span: 'col-span-1 md:col-span-1 row-span-1' },
    { src: coupleHelipad, alt: 'No heliporto', span: 'col-span-2 md:col-span-2 row-span-1' },
    { src: coupleSunset, alt: 'Por do sol romântico', span: 'col-span-1 md:col-span-1 row-span-1' },
    { src: coupleRomantic, alt: 'Momento romântico', span: 'col-span-1 md:col-span-1 row-span-1' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const, // Custom easing for smooth reveal
      },
    },
  };

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Decorative Elements */}
      <FloralDecoration variant="top-left" className="opacity-60" />
      <FloralDecoration variant="bottom-right" className="opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] text-primary uppercase mb-4">Nossa História</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">Momentos Especiais</h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative group rounded-xl overflow-hidden shadow-lg ${image.span}`}
              style={{ minHeight: index < 2 || index === 3 ? '450px' : '250px' }}
            >
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-6">
                <p className="text-white font-body text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 text-center max-w-3xl mx-auto px-4"
        >
          <div className="relative inline-block">
            <span className="absolute -top-6 -left-6 text-6xl text-primary/20 font-heading">"</span>
            <blockquote className="font-heading text-2xl md:text-3xl text-charcoal/80 italic leading-relaxed">
              Encontrei em ti o meu lar, meu melhor amigo, e o amor da minha vida.
            </blockquote>
            <span className="absolute -bottom-10 -right-6 text-6xl text-primary/20 font-heading transform rotate-180">"</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
