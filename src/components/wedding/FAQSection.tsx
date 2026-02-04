import { motion } from 'framer-motion';
import { Copy, Check, Gift, Shirt, Baby, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const [copied, setCopied] = useState(false);
  const IBAN = "PT50000700000000000000000";

  const handleCopyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(IBAN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const faqs = [
    {
      icon: Shirt,
      question: "Qual é o dress code?",
      answer: "Pedimos elegância e formalidade. Mães e madrinhas: tons de verde e amarelo são bem-vindos. O branco é reservado exclusivamente para a noiva. Cavalheiros: fato escuro ou smoking."
    },
    {
      icon: Baby,
      question: "Posso levar crianças?",
      answer: "Este será um evento íntimo apenas para adultos. Agradecemos a vossa compreensão e esperamos que possam aproveitar a noite de celebração connosco."
    },
    {
      icon: Gift,
      question: "E quanto aos presentes?",
      answer: (
        <div className="space-y-4">
          <p>
            A vossa presença é o maior presente que nos podem dar! No entanto, se desejarem contribuir para o início da nossa vida a dois, podem fazê-lo através de:
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-accent/50 rounded-lg">
            <code className="font-mono text-sm text-charcoal bg-background px-3 py-2 rounded border">
              {IBAN}
            </code>
            <button
              onClick={handleCopyIBAN}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar IBAN
                </>
              )}
            </button>
          </div>
        </div>
      )
    },
    {
      icon: HelpCircle,
      question: "Posso estacionar no local?",
      answer: "Sim, ambos os locais dispõem de estacionamento gratuito para os convidados. Contudo, se planeia beber, considere organizar transporte alternativo ou partilhar boleia com outros convidados."
    },
  ];

  return (
    <section className="relative section-padding bg-background overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle mb-4">Perguntas Frequentes</p>
          <h2 className="section-title mb-4">Informações Importantes</h2>
          <div className="divider-ornament" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-elegant border-none px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                      <faq.icon className="w-5 h-5 text-sage-dark" />
                    </div>
                    <span className="font-heading text-lg md:text-xl text-charcoal">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-14">
                  <div className="font-body text-muted-foreground leading-relaxed">
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
