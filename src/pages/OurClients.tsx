import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useCompanyInfo,
  useClients,
  useTestimonials,
} from "@/hooks/useLocalizedConstants";
import { ArrowRight } from "lucide-react";

const OurClientsPage: FC = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const clients = useClients();
  const testimonials = useTestimonials();

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const { ref: titleRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: clientsRef, inView: clientsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <Helmet>
        <title>
          {t("our_clients")} | {companyInfo.name}
        </title>
        <meta name="description" content={t("our_clients_page_description")} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-brand-blue text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots"></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-brand-orange text-white px-3 py-1 rounded-md text-sm font-medium mb-4">
              {t("TAILORED_SOLUTIONS")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("our_clients")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t("our_clients_page_description")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Clients Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {t("trusted_by_industry_leaders")}
            </h2>
            <p className="text-gray-600">{t("client_trust_description")}</p>
          </div>

          <motion.div
            ref={clientsRef}
            initial="hidden"
            animate={clientsInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center"
          >
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-32 w-full"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("what_our_clients_say")}
            </h2>
            <div className="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("testimonial_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="mb-2">
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                    <p className="text-sm text-brand-teal font-medium">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{t(testimonial.content)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t("become_our_client")}
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {t("client_partnership_description")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              <Link to="/contact" className="inline-flex items-center gap-2">
                <span>{t("contact_us_today")}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurClientsPage;
