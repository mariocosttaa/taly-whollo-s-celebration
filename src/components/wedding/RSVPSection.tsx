import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FloralDecoration } from "./FloralDecoration";
import { Check, X, Loader2 } from "lucide-react";

import api from "@/lib/api";

const RSVPSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAttendance = (status: "confirmed" | "declined") => {
    setFormData({ ...formData, attendance: status });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.attendance) {
      toast({
        title: "Por favor, selecione uma opção",
        description: "Indique se poderá comparecer ou não.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/rsvp", formData);
      setIsSubmitted(true);
      toast({
        title:
          formData.attendance === "confirmed"
            ? "Presença Confirmada! 🎉"
            : "Obrigado pela resposta! 💫",
        description:
          formData.attendance === "confirmed"
            ? "Estamos muito felizes por celebrar consigo!"
            : "Sentiremos a sua falta, obrigado por avisar.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description:
          "Ocorreu um erro ao enviar a sua resposta. Por favor tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-6 py-4 bg-white border border-stone-200 rounded-xl font-body text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm hover:border-primary/30";
  const labelClasses =
    "block font-body text-sm font-medium text-stone-600 mb-2 ml-1 uppercase tracking-wider";

  return (
    <section
      id="rsvp"
      className="relative py-24 md:py-32 bg-stone-50 overflow-hidden"
    >
      <div className="relative max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm md:text-base tracking-[0.2em] uppercase text-primary mb-4">
            Confirme a Sua Presença
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-stone-800 mb-6">
            RSVP
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mb-8 rounded-full" />
          <p className="font-body text-stone-600 text-lg max-w-md mx-auto leading-relaxed">
            Por favor confirme a sua presença até{" "}
            <strong className="text-primary">15 de Junho de 2026</strong>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-elegant"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                    className={inputClasses}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Confirmação *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => handleAttendance("confirmed")}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 group ${
                      formData.attendance === "confirmed"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-stone-200 hover:border-primary/50 text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    <span className="text-2xl transition-transform group-hover:scale-110">
                      🎉
                    </span>
                    <span className="font-heading font-medium tracking-wide">
                      Sim, Eu Vou!
                    </span>
                    {formData.attendance === "confirmed" && (
                      <div className="absolute top-2 right-2 text-primary">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAttendance("declined")}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 group ${
                      formData.attendance === "declined"
                        ? "border-stone-400 bg-stone-100 text-stone-600"
                        : "border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    <span className="text-2xl transition-transform group-hover:scale-110">
                      😢
                    </span>
                    <span className="font-heading font-medium tracking-wide">
                      Não Poderei Ir
                    </span>
                    {formData.attendance === "declined" && (
                      <div className="absolute top-2 right-2 text-stone-600">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Mensagem (Opcional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Deixe uma mensagem para os noivos..."
                  className={inputClasses}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-charcoal text-white rounded-xl font-heading tracking-widest uppercase hover:bg-primary transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Confirmação"
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 md:p-16 rounded-3xl border border-stone-100 shadow-elegant text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-3xl text-stone-800 mb-4">
                {formData.attendance === "confirmed"
                  ? "Confirmado! 🎉"
                  : "Obrigado! ✨"}
              </h3>
              <p className="font-body text-stone-600 text-lg">
                {formData.attendance === "confirmed"
                  ? "A sua presença foi confirmada com sucesso. Estamos ansiosos para celebrar este dia especial consigo!"
                  : "Agradecemos por nos informar. Sentiremos a sua falta!"}
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    attendance: "",
                    message: "",
                  });
                }}
                className="mt-8 text-primary hover:text-primary-dark underline underline-offset-4 transition-colors font-body"
              >
                Enviar outra resposta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RSVPSection;
