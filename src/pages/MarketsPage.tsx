import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import GlobalWorkforceMap from '../components/sections/GlobalWorkforceMap';


const MarketsPage: React.FC = () => {
  const { t } = useLanguage();
  // Animation variants for sections
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Animation variants for staggered fade-in
  const fadeInAnimationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
        duration: 0.5
      }
    })
  };

  // Intersection observer hooks for animation triggers
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: industriesRef, inView: industriesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: locationsRef, inView: locationsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Data for the page
  const industries = [
    { id: 1, name: t("industry_hotels_resorts") },
    { id: 2, name: t("industry_safari_lodges") },
    { id: 3, name: t("industry_restaurants") },
    { id: 4, name: t("industry_conference_centers") },
    { id: 5, name: t("industry_cruise") },
    { id: 6, name: t("industry_airlines") }
  ];

  const locations = [
    { id: 1, name: "United States", cities: "Cambridge (Maryland), Maui, Kauai, Kihei, Kahului (Hawaii), Bellevue, Seattle (Washington), Stowe (Vermont)" },
    { id: 2, name: "Ghana", cities: "Accra, Kumasi" }
  ];

  return (
    <>
      <Helmet>
        <title>{t("markets_page_title")} | BOH Concepts</title>
        <meta name="description" content={t("markets_meta_description")} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 overflow-hidden bg-brand-blue text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots"></div>
        </div>

        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-brand-orange text-white px-3 py-1 rounded-md text-sm font-medium mb-4">
              {t("markets_hero_tag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("markets_hero_title")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t("markets_hero_subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-16">
            <motion.span 
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="inline-block text-brand-orange font-medium mb-3"
            >
              {t("markets_section_tag")}
            </motion.span>
            
            <motion.h2 
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {t("markets_section_title")}
            </motion.h2>
            
            <motion.div 
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={{
                hidden: { width: "0%", opacity: 0 },
                visible: {
                  width: "80px",
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.4, ease: "easeOut" }
                }
              }}
              className="h-1 bg-brand-orange mx-auto rounded-full"
            ></motion.div>
            
            <motion.p
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
            >
              {t("markets_section_description")}
            </motion.p>
          </div>

          <div ref={industriesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              animate={industriesInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-orange hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("markets_service_1_title")}</h3>
              <p className="text-gray-600">
                {t("markets_service_1_description")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={industriesInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
              }}
              className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-blue hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("markets_service_2_title")}</h3>
              <p className="text-gray-600">
                {t("markets_service_2_description")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={industriesInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }
              }}
              className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-orange hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("markets_service_3_title")}</h3>
              <p className="text-gray-600">
                {t("markets_service_3_description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Africa Chooses Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-brand-orange font-medium mb-3">
              {t("markets_why_tag")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("markets_why_title")}
            </h2>
            <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 border-l-4 border-brand-blue"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{t("markets_why_1_title")}</h3>
              <p className="text-gray-600">{t("markets_why_1_description")}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 border-l-4 border-brand-orange"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{t("markets_why_2_title")}</h3>
              <p className="text-gray-600">{t("markets_why_2_description")}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 border-l-4 border-brand-blue"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{t("markets_why_3_title")}</h3>
              <p className="text-gray-600">{t("markets_why_3_description")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Workforce Map */}
      <GlobalWorkforceMap />

      {/* Industries We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-brand-orange font-medium mb-3">
              {t("markets_industries_tag")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("markets_industries_title")}
            </h2>
            <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <p className="text-lg font-medium text-gray-800">{industry.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Presence */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div ref={locationsRef} className="text-center mb-12">
            <motion.span
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="inline-block text-brand-orange font-medium mb-3"
            >
              GEOGRAPHIC REACH
            </motion.span>
            
            <motion.h2
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Areas of Operation
            </motion.h2>
            
            <motion.div
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={{
                hidden: { width: "0%", opacity: 0 },
                visible: {
                  width: "80px",
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.4, ease: "easeOut" }
                }
              }}
              className="h-1 bg-brand-orange mx-auto rounded-full"
            ></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{location.name}</h3>
                <p className="text-gray-600">{location.cities}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner With Us */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-brand-orange text-white px-3 py-1 rounded-md text-sm font-medium mb-4">
              {t("markets_partnership_tag")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("markets_partnership_title")}
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-white/90 mb-8">
              {t("markets_partnership_description")}
            </p>
            
            <Link to="/contact" className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
              {t("markets_contact_us_today")}
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            {t("markets_cta_heading")}
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="inline-block bg-brand-blue hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              {t("get_started")}
            </Link>
            <Link
              to="/contact" 
              className="inline-block bg-white border-2 border-brand-blue text-brand-blue hover:bg-gray-50 font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              {t("talk_to_specialist")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default MarketsPage;
