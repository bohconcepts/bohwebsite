import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import { Award, Eye } from "lucide-react";

const MissionPage = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();

  return (
    <>
      <Helmet>
        <title>{t("Our Mission")} | {companyInfo.name}</title>
        <meta
          name="description"
          content={t("mission_meta_description")}
        />
      </Helmet>

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
              {t('OUR MISSION')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              {t('mission_page_title')}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {t("mission_overview_description")}
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 text-center relative"
            >
              <span className={t("mission_heading_color")}>
                {t("mission_heading")}
              </span>
              <div className="w-24 h-1 bg-brand-orange mx-auto mt-4 rounded-full"></div>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative overflow-hidden"
              >
                <div className="bg-gradient-to-br from-brand-blue to-brand-blue/90 p-5 sm:p-8 rounded-xl text-white shadow-lg h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                  <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-brand-orange/20 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 rounded-full bg-brand-orange/10 blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 hover:bg-white/20 transition-all duration-300 about-icon-container">
                      <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <Award className="w-8 h-8 text-brand-orange hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-white hover:text-white/80 transition-colors duration-300 about-heading">
                      {t("mission_title")}
                    </h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      className="text-white/90 leading-relaxed about-text"
                    >
                      {t("mission_description")}
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative overflow-hidden"
              >
                <div className="bg-gradient-to-br from-brand-orange to-brand-orange/90 p-8 rounded-xl text-white shadow-lg h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                  <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-brand-blue/20 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 rounded-full bg-brand-blue/10 blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 hover:bg-white/20 transition-all duration-300 about-icon-container">
                      <motion.div
                        initial={{ rotate: 10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Eye className="w-8 h-8 text-white hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-white hover:text-white/80 transition-colors duration-300 about-heading">
                      {t("vision_title")}
                    </h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="text-white/90 text-lg leading-relaxed"
                    >
                      {t("vision_description")}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="max-w-3xl mx-auto mt-16 text-center"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Our Commitment</h3>
              <p className="text-lg text-gray-600 mb-8">
                At BOH Concepts,we are committed to redefining hospitality staffing through excellence, 
                diversity, and sustainable partnerships. We believe that by investing in our people and 
                maintaining the highest standards of service, we can transform the hospitality industry 
                and create meaningful opportunities for growth.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default MissionPage;
