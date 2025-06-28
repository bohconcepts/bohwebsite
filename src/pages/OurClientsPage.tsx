import { FC } from "react";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyInfo, useClients, useTestimonials } from '@/hooks/useLocalizedConstants';
import { ArrowRight } from "lucide-react";

const OurClientsPage: FC = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const clients = useClients();
  const testimonials = useTestimonials();
  
  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const testimonialVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6
      }
    })
  };

  const { ref: titleRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: clientsRef, inView: clientsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <Helmet>
        <title>{t("our_clients")} | {companyInfo.name}</title>
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
              {t('TAILORED_SOLUTIONS')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase mb-6">
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
            <h2 className="text-3xl uppercase mb-4">{t("trusted_by_industry_leaders")}</h2>
            <p className="text-gray-600">{t("client_trust_description")}</p>
          </div>
          
          <motion.div 
            ref={clientsRef}
            initial="hidden"
            animate={clientsInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {clients.map((client) => (
              <div key={client.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-32 w-full">
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
            <h2 className="text-3xl uppercase text-gray-900 mb-4">{t("what_our_clients_say")}</h2>
            <div className="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("testimonial_description")}
            </p>
          </div>

          {/* All Testimonials in Same Design */}
          <motion.div 
            ref={testimonialsRef}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                custom={index}
                variants={testimonialVariants}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="mb-6 flex-grow">
                  <svg className="h-8 w-8 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <blockquote className="text-gray-600 mb-6">
                    {t(testimonial.content)}
                  </blockquote>
                </div>
                <div className="mt-auto">
                  <div className="font-medium text-gray-900">{testimonial.author}</div>
                  <div className="mt-1 text-sm text-gray-500">{testimonial.position}</div>
                  {testimonial.location && (
                    <div className="mt-1 text-sm text-brand-teal font-medium">{testimonial.location}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl uppercase mb-6">{t("become_our_client")}</h2>
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
