import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import { ArrowRight } from "lucide-react";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import "@/styles/image-cards.css";

const WhyChooseUsPage = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();

  // Create refs for animations
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <Helmet>
        <title>{`${t('Why Choose Us')} | ${companyInfo.name}`}</title>
        <meta
          name="description"
          content="Discover why BOH Concepts is the premier choice for hospitality staffing solutions."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
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
            ref={heroRef}
          >
            <span className="inline-block bg-brand-orange text-white px-3 py-1 rounded-md text-sm font-medium mb-4">
              {t('OUR ADVANTAGES')}
            </span>
            {/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("Why Choose Us")}
            </h1> */}
            <motion.div
              initial={{ width: "0%" }}
              animate={heroInView ? { width: "120px" } : { width: "0%" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="h-1 bg-brand-orange rounded-full mb-8 ml-0"
            ></motion.div>
            <p className="text-xl text-white/90 max-w-2xl">
              {t(
                "We provide tailored hospitality staffing services to meet your specific needs, whether you are seeking talent or opportunities."
              )}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Additional Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl uppercase text-gray-900 mb-4">{t("our_unique_advantages")}</h2>
            <div className="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("unique_advantages_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Advantage 1 */}
            <div className="image-card">
              <img 
                src="/images/whychooseus/managestaff.jpeg" 
                alt={t("quality_assurance")} 
                className="image-card-img"
              />
              <div className="image-card-overlay">
                <h3 className="image-card-title">
                  {t("quality_assurance")}
                </h3>
                <p className="image-card-text">
                  {t("quality_assurance_description")}
                </p>
              </div>
            </div>

            {/* Advantage 2 */}
            <div className="image-card">
              <img 
                src="/images/whychooseus/fastresponsenew.png" 
                alt={t("fast_response_time")} 
                className="image-card-img"
              />
              <div className="image-card-overlay">
                <h3 className="image-card-title">
                  {t("fast_response_time")}
                </h3>
                <p className="image-card-text">
                  {t("fast_response_description")}
                </p>
              </div>
            </div>

            {/* Advantage 3 */}
            <div className="image-card">
              <img 
                src="/images/whychooseus/personalizedmatching.png" 
                alt={t("personalized_matching")} 
                className="image-card-img"
              />
              <div className="image-card-overlay">
                <h3 className="image-card-title">
                  {t("personalized_matching")}
                </h3>
                <p className="image-card-text">
                  {t("personalized_matching_description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-blue/5">
        <div className="container mx-auto px-4">
          <div className="bg-brand-blue rounded-2xl p-10 md:p-16 text-center max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl uppercase text-white mb-6">
              {t("ready_to_experience_difference")}
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
              {t("partner_with_us_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-brand-orange text-white hover:bg-brand-orange/90 group"
              >
                <Link to="/contact" className="flex items-center gap-2">
                  <span>{t("contact_us_today")}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-brand-blue/50"
              >
                <Link to="/our-approach">{t("explore_our_services")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default WhyChooseUsPage;
