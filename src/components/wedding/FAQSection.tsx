import { motion } from "framer-motion";
import { Shirt, Baby, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FloralDecoration } from "./FloralDecoration";

const FAQSection = () => {
  const faqs = [
    {
      icon: Shirt,
      question: "Qual é o dress code?",
      answer:
        "Pedimos elegância e formalidade. Mães e madrinhas: tons de verde e amarelo são bem-vindos. O branco é reservado exclusivamente para a noiva. Cavalheiros: fato escuro ou smoking.",
    },
    {
      icon: Baby,
      question: "Posso levar crianças?",
      answer:
        "Este será um evento íntimo apenas para adultos. Agradecemos a vossa compreensão e esperamos que possam aproveitar a noite de celebração connosco.",
    },
    {
      icon: HelpCircle,
      question: "Posso estacionar no local?",
      answer:
        "Sim, ambos os locais dispõem de estacionamento gratuito para os convidados. Contudo, se planeia beber, considere organizar transporte alternativo ou partilhar boleia com outros convidados.",
    },
  ];

  return (
    <section className="relative pt-24 md:pt-32 pb-48 md:pb-80 bg-background overflow-hidden">
      {/* Decorative Background */}
      <FloralDecoration variant="bottom-left" flowerNumber={1} />
      <FloralDecoration
        variant="top-right"
        flowerNumber={2}
        className="opacity-50 translate-x-0 translate-y-0 right-0 top-0"
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] text-primary uppercase mb-4">
            Perguntas Frequentes
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">
            Informações Importantes
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-primary/10 rounded-2xl bg-white/60 backdrop-blur-sm overflow-hidden px-2 data-[state=open]:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <AccordionTrigger className="px-4 hover:no-underline hover:text-primary transition-colors py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
                      <faq.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-heading text-lg md:text-xl text-charcoal">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-6 pt-0">
                  <div className="pl-14 text-muted-foreground font-body text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
