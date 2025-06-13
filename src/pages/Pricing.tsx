import { FC } from "react";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyInfo, usePricingPlans } from '@/hooks/useLocalizedConstants';
import { PricingPlan } from '@/lib/localization/types';
import { ArrowRight, Check } from "lucide-react";

const PricingPage: FC = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const pricingPlans: PricingPlan[] = usePricingPlans();
  
  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: pricingRef, inView: pricingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <Helmet>
        <title>{t("pricing")} | {companyInfo.name}</title>
        <meta name="description" content={t("pricing_description")} />
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
              {t("pricing")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t("pricing_description")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Plans */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            ref={titleRef}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("flexible_pricing_options")}</h2>
            <div className="w-24 h-1 bg-brand-orange mb-6 mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("pricing_plans_description")}
            </p>
          </motion.div>

          <motion.div 
            ref={pricingRef}
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan: PricingPlan) => (
              <motion.div
                key={plan.id}
                variants={fadeInUpVariants}
                className={`bg-white rounded-xl shadow-lg border ${plan.isPopular ? 'border-brand-orange' : 'border-gray-200'} p-8 relative flex flex-col h-full`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-brand-orange text-white py-1 px-4 rounded-bl-lg rounded-tr-lg font-medium text-sm">
                    {t("most_popular")}
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{t(plan.name)}</h3>
                <p className="text-gray-600 mb-6">{t(plan.description)}</p>
                
                <div className="text-3xl font-bold mb-6 text-brand-blue">
                  {t(plan.price)}
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-brand-orange mr-2 flex-shrink-0 mt-0.5" />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/contact" className="mt-auto">
                  <Button className={`w-full py-6 ${plan.isPopular ? 'bg-brand-orange hover:bg-brand-orange/90' : 'bg-brand-blue hover:bg-brand-blue/90'}`}>
                    {t("get_a_quote")}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-left mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("frequently_asked_questions")}</h2>
            <div className="w-24 h-1 bg-brand-orange mb-6"></div>
            <p className="text-gray-600 max-w-2xl">
              {t("faq_description")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t("faq_pricing_question")}</h3>
              <p className="text-gray-600">
                {t("faq_pricing_answer")}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t("faq_contracts_question")}</h3>
              <p className="text-gray-600">
                {t("faq_contracts_answer")}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t("faq_upgrade_question")}</h3>
              <p className="text-gray-600">
                {t("faq_upgrade_answer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">{t("ready_to_get_started")}</h2>
            <p className="text-xl mb-8">{t("contact_for_quote")}</p>
            <Link to="/contact">
              <Button className="bg-white text-brand-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-medium flex items-center gap-2">
                {t("request_a_quote")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;
