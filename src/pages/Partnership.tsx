import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link2, Building, Users, Globe } from "lucide-react";

import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartnershipForm } from "@/components/forms/PartnershipForm";

const Partnership = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${t('Partner With Us')} | ${companyInfo.name}`}</title>
        <meta
          name="description"
          content={t("Explore partnership opportunities with us. Submit your partnership request and join our network of successful collaborators.")}
        />
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
              {t("COLLABORATION")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase mb-6">
              {t("Partner With Us")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t("Join our network of partners and collaborate with us to achieve mutual growth and success. We believe in the power of strategic partnerships.")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Partnership Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl uppercase mb-4 text-brand-blue">
              {t("Why Partner With Us")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("Discover the advantages of forming a strategic partnership with our organization. Together, we can achieve more.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-brand-blue/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Link2 className="text-brand-blue" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("Strategic Growth")}</h3>
              <p className="text-gray-600">
                {t("Leverage our expertise and resources to accelerate your business growth and expand your market reach.")}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-brand-blue/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="text-brand-blue" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("Innovation")}</h3>
              <p className="text-gray-600">
                {t("Collaborate on innovative solutions and stay ahead of industry trends with our cutting-edge approaches.")}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-brand-blue/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="text-brand-blue" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("Network Access")}</h3>
              <p className="text-gray-600">
                {t("Gain access to our extensive network of industry contacts, potential clients, and valuable resources.")}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-brand-blue/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Globe className="text-brand-blue" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("Global Reach")}</h3>
              <p className="text-gray-600">
                {t("Expand your global footprint through our international presence and cross-border capabilities.")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Partnership Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <motion.h2 
                className="text-3xl uppercase mb-6 text-brand-blue"
                variants={itemVariants}
              >
                {t('Partnership Opportunities')}
              </motion.h2>
              
              <motion.p
                className="text-lg text-gray-600 mb-6"
                variants={itemVariants}
              >
                {t('We are always looking for strategic partnerships that align with our vision and values. Whether you are interested in technology integration, distribution, marketing collaboration, or any other form of partnership, we would love to hear from you.')}
              </motion.p>
              
              <motion.p
                className="text-lg text-gray-600 mb-6"
                variants={itemVariants}
              >
                {t('Fill out the form with your partnership request, and our team will get back to you to discuss potential collaboration opportunities.')}
              </motion.p>
              
              <motion.div
                className="bg-brand-blue/5 p-6 rounded-lg border border-brand-blue/20 mb-6"
                variants={itemVariants}
              >
                <h3 className="font-semibold text-xl mb-3 text-brand-blue">{t('Partnership Process')}</h3>
                <ol className="space-y-2 list-decimal pl-5">
                  <li className="text-gray-700">{t('Submit your partnership request')}</li>
                  <li className="text-gray-700">{t('Initial consultation with our partnership team')}</li>
                  <li className="text-gray-700">{t('Evaluation of partnership opportunity')}</li>
                  <li className="text-gray-700">{t('Partnership proposal and agreement')}</li>
                  <li className="text-gray-700">{t('Launch and grow together')}</li>
                </ol>
              </motion.div>
            </motion.div>
            
            {/* Partnership Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <PartnershipForm />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials/Current Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl uppercase mb-4 text-brand-blue">
              {t("Partners")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("We are proud to work with leading organizations across various industries. Join our growing network of partners.")}
            </p>
          </motion.div>
          
          {/* Partner logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            <motion.div 
              className="h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a 
                href="https://www.hilton.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
                aria-label="Visit Hilton Hotels website"
              >
                <img 
                  src="/images/clients/Hilton-Logo-4.png" 
                  alt="Hilton Hotels" 
                  className="max-h-full max-w-full object-contain filter hover:brightness-110 transition-all duration-300" 
                />
              </a>
            </motion.div>
            <motion.div 
              className="h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a 
                href="https://www.hyatt.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
                aria-label="Visit Hyatt Hotels website"
              >
                <img 
                  src="/images/clients/Hyatt.png" 
                  alt="Hyatt Hotels" 
                  className="max-h-full max-w-full object-contain filter hover:brightness-110 transition-all duration-300" 
                />
              </a>
            </motion.div>
            <motion.div 
              className="h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a 
                href="https://www.hyatt.com/brands/thompson-hotels" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
                aria-label="Visit Thompson Hotels website"
              >
                <img 
                  src="/images/clients/Thompson.jpg" 
                  alt="Thompson Hotels" 
                  className="max-h-full max-w-full object-contain filter hover:brightness-110 transition-all duration-300" 
                />
              </a>
            </motion.div>
            <motion.div 
              className="h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a 
                href="https://www.hilton.com/en/waldorf-astoria/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
                aria-label="Visit Waldorf Astoria website"
              >
                <img 
                  src="/images/clients/Waldorf.png" 
                  alt="Waldorf Astoria" 
                  className="max-h-full max-w-full object-contain filter hover:brightness-110 transition-all duration-300" 
                />
              </a>
            </motion.div>
            <motion.div 
              className="h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a 
                href="https://www.hyatt.com/brands/destination-by-hyatt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
                aria-label="Visit Destination Hotels website"
              >
                <img 
                  src="/images/clients/destination.png" 
                  alt="Destination Hotels" 
                  className="max-h-full max-w-full object-contain filter hover:brightness-110 transition-all duration-300" 
                />
              </a>
            </motion.div>
            <motion.div 
              className="h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a 
                href="https://www.hyatt.com/brands/andaz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
                aria-label="Visit Andaz Hotels website"
              >
                <img 
                  src="/images/clients/andaz.png" 
                  alt="Andaz Hotels" 
                  className="max-h-full max-w-full object-contain filter hover:brightness-110 transition-all duration-300" 
                />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partnership;
