import { motion } from 'framer-motion';
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
    { src: coupleHelicopter, alt: 'Casal elegante junto ao helicóptero', span: 'col-span-1 row-span-2' },
    { src: coupleEmbrace, alt: 'Abraço romântico', span: 'col-span-1 row-span-1' },
    { src: coupleFashion, alt: 'Casal estiloso', span: 'col-span-1 row-span-1' },
    { src: coupleKiss, alt: 'Beijo apaixonado', span: 'col-span-1 row-span-2' },
    { src: coupleWalking, alt: 'Caminhada de mãos dadas', span: 'col-span-1 row-span-1' },
    { src: coupleHelipad, alt: 'No heliporto', span: 'col-span-2 row-span-1' },
    { src: coupleSunset, alt: 'Por do sol romântico', span: 'col-span-1 row-span-1' },
    { src: coupleRomantic, alt: 'Momento romântico', span: 'col-span-1 row-span-1' },
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative section-padding bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle mb-4">Nossa História</p>
          <h2 className="section-title mb-4">Momentos Especiais</h2>
          <div className="divider-ornament" />
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="gallery-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`gallery-item rounded-lg overflow-hidden ${image.span}`}
              style={{ minHeight: index < 2 || index === 3 ? '400px' : '200px' }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <blockquote className="font-heading text-xl md:text-2xl text-charcoal/80 italic leading-relaxed">
            "Encontrei em ti o meu lar, meu melhor amigo, e o amor da minha vida."
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
