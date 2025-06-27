import { useState } from "react";
import { motion, Variants, Easing } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import {
  // Removed useServices as it's not being used
} from "@/hooks/useLocalizedConstants";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  // Removed unused icon imports
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Create separate refs for title and cards for different animation triggers
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as Easing },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2, ease: "easeOut" as Easing },
    },
  };

  // Animation variants removed as they're no longer needed

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as Easing,
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const cardHoverVariants: Variants = {
    initial: {
      y: 0,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    hover: {
      y: -8,
      boxShadow:
        "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      transition: {
        duration: 0.3,
        ease: "easeOut" as Easing,
      },
    },
  };

  const backgroundVariants: Variants = {
    initial: {
      background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
    },
    hover: {
      background: "linear-gradient(135deg, #ffffff 0%, #fef7f0 100%)",
      transition: {
        duration: 0.4,
        ease: "easeInOut" as Easing,
      },
    },
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="section-title-container mb-16">
          <motion.h2
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            variants={titleVariants}
            className="section-title"
          >
            {t("Premium Staffing Solutions")}
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            variants={{
              hidden: { width: "0%", opacity: 0 },
              visible: {
                width: "5rem",
                opacity: 1,
                transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
              }
            }}
            className="section-title-underline"
          ></motion.div>

          <motion.p
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            variants={subtitleVariants}
            className="section-title-description"
          >
            {t("We provide tailored hospitality staffing services to meet your specific needs, whether you are seeking talent or opportunities.")}
          </motion.p>
        </div>

        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12"
        >
          {/* Vetted Long-Term Talents */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            initial="initial"
            onMouseEnter={() => setHoveredCard('long-term')}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative group overflow-hidden rounded-2xl transition-all duration-300 h-full flex w-full bg-white shadow-sm hover:shadow-md"
          >
            <motion.div
              variants={cardHoverVariants}
              className="w-full rounded-2xl"
            >
              <motion.div
                variants={backgroundVariants}
                className="w-full h-full flex flex-col rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="w-full h-56 overflow-hidden bg-gray-100">
                  <img
                    src="/images/services/Professional Chefs.jpg"
                    alt="Professional Chefs"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="w-full p-6 flex flex-col justify-between h-64">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t("Vetted Long-Term Talents")}</h3>
                  <motion.div
                    initial={{ width: "48px" }}
                    animate={hoveredCard === 'long-term' ? { width: "64px" } : { width: "48px" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-1 bg-brand-orange rounded-full mb-3"
                  ></motion.div>
                
                  <p className="text-gray-600 mb-auto text-sm leading-relaxed h-24 overflow-hidden">
                    {t("long_term_talents_description")}
                  </p>
                
                  <Link to="/services">
                    <motion.div
                      initial={{ opacity: 0.7, x: 0 }}
                      animate={hoveredCard === 'long-term' ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex items-center text-brand-blue font-medium hover:text-brand-orange mt-auto"
                    >
                      <span className="mr-2">{t("Learn More")}</span>
                      <motion.div
                        animate={hoveredCard === 'long-term' ? { x: 4 } : { x: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Vetted Seasonal Talents */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            initial="initial"
            onMouseEnter={() => setHoveredCard('seasonal')}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative group overflow-hidden rounded-2xl transition-all duration-300 h-full flex w-full bg-white shadow-sm hover:shadow-md"
          >
            <motion.div
              variants={cardHoverVariants}
              className="w-full rounded-2xl"
            >
              <motion.div
                variants={backgroundVariants}
                className="w-full h-full flex flex-col rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="w-full h-56 overflow-hidden bg-gray-100">
                  <img
                    src="/images/services/Couple Checking In.jpg"
                    alt="Couple Checking In"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="w-full p-6 flex flex-col justify-between h-64">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t("Vetted Seasonal Talents")}</h3>
                  <motion.div
                    initial={{ width: "48px" }}
                    animate={hoveredCard === 'seasonal' ? { width: "64px" } : { width: "48px" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-1 bg-brand-orange rounded-full mb-3"
                  ></motion.div>
                
                  <p className="text-gray-600 mb-auto text-sm leading-relaxed h-24 overflow-hidden">
                    {t("seasonal_talents_description")}
                  </p>
                
                  <Link to="/services">
                    <motion.div
                      initial={{ opacity: 0.7, x: 0 }}
                      animate={hoveredCard === 'seasonal' ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex items-center text-brand-blue font-medium hover:text-brand-orange mt-auto"
                    >
                      <span className="mr-2">{t("Learn More")}</span>
                      <motion.div
                        animate={hoveredCard === 'seasonal' ? { x: 4 } : { x: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Special Projects & Services */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            initial="initial"
            onMouseEnter={() => setHoveredCard('projects')}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative group overflow-hidden rounded-2xl transition-all duration-300 h-full flex w-full bg-white shadow-sm hover:shadow-md"
          >
            <motion.div
              variants={cardHoverVariants}
              className="w-full rounded-2xl"
            >
              <motion.div
                variants={backgroundVariants}
                className="w-full h-full flex flex-col rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="w-full h-56 overflow-hidden bg-gray-100">
                  <img
                    src="/images/services/projects.png"
                    alt="Special Projects & Services"
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="w-full p-6 flex flex-col justify-between h-64">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t("Special Projects & Services")}</h3>
                  <motion.div
                    initial={{ width: "48px" }}
                    animate={hoveredCard === 'projects' ? { width: "64px" } : { width: "48px" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-1 bg-brand-orange rounded-full mb-3"
                  ></motion.div>
                
                  <p className="text-gray-600 mb-auto text-sm leading-relaxed h-24 overflow-hidden">
                    {t("Specialized cleaning and maintenance solutions designed specifically for hospitality businesses. Our expert teams deliver high-quality project-based services to enhance your facility's appearance, functionality, and guest experience.")}
                  </p>
                
                  <Link to="/services">
                    <motion.div
                      initial={{ opacity: 0.7, x: 0 }}
                      animate={hoveredCard === 'projects' ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex items-center text-brand-blue font-medium hover:text-brand-orange mt-auto"
                    >
                      <span className="mr-2">{t("Learn More")}</span>
                      <motion.div
                        animate={hoveredCard === 'projects' ? { x: 4 } : { x: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-brand-orange text-brand-orange bg-transparent hover:bg-brand-orange hover:text-white transition-colors"
          >
            <Link to="/our-approach" className="inline-flex items-center gap-2">
              <span>{t("View All Services")}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
