import { FC } from "react";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyInfo } from '@/hooks/useLocalizedConstants';
import { ArrowRight } from "lucide-react";

const OurProcessPage: FC = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  
  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const { ref: titleRef } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const { ref: processRef, inView: processInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Process steps - using localization keys for future translation
  const processSteps = [
    {
      id: "1",
      titleKey: "process_step1_title",
      descriptionKey: "process_step1_description",
      icon: "🤝"
    },
    {
      id: "2",
      titleKey: "process_step2_title",
      descriptionKey: "process_step2_description",
      icon: "🔍"
    },
    {
      id: "3",
      titleKey: "process_step3_title",
      descriptionKey: "process_step3_description",
      icon: "✓"
    },
    {
      id: "4",
      titleKey: "process_step4_title",
      descriptionKey: "process_step4_description",
      icon: "📚"
    },
    {
      id: "5",
      titleKey: "process_step5_title",
      descriptionKey: "process_step5_description",
      icon: "🔄"
    },
    {
      id: "6",
      titleKey: "process_step6_title",
      descriptionKey: "process_step6_description",
      icon: "📈"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("our_process")} | {companyInfo.name}</title>
        <meta name="description" content={t("our_process_description")} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 overflow-hidden bg-brand-blue text-white">
        {/* Background pattern */}
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
              {t('TAILORED SOLUTIONS')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("our_process")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t("our_process_card_description")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            ref={titleRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">{t("how_we_work")}</h2>
            <div className="h-1 w-20 bg-brand-orange mb-6 mx-auto"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("our_process_subtitle")}
            </p>
          </motion.div>

          <motion.div 
            ref={processRef}
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>
              
              {/* Process steps */}
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={fadeInUpVariants}
                  className="mb-12 relative"
                >
                  <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Step number with icon */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue text-white flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 z-10">
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:ml-8 md:text-left' : 'md:mr-8 md:text-right'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {t(step.titleKey)}
                        </h3>
                        <p className="text-gray-600">
                          {t(step.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("benefits_of_our_process")}</h2>
            <div className="h-1 w-20 bg-brand-orange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("process_benefits_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-2xl">
                ⏱️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t("benefit_time_efficiency")}
              </h3>
              <p className="text-gray-600">
                {t("benefit_time_efficiency_description")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t("benefit_quality_assurance")}
              </h3>
              <p className="text-gray-600">
                {t("benefit_quality_assurance_description")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-2xl">
                🤝
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t("benefit_ongoing_support")}
              </h3>
              <p className="text-gray-600">
                {t("benefit_ongoing_support_description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{t("ready_to_start_journey")}</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("process_cta_description")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              <Link to="/contact" className="inline-flex items-center gap-2">
                <span>{t("get_started_today")}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurProcessPage;
