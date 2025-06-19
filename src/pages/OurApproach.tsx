import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { FrameworkSection } from "@/components/framework";
import {
  Briefcase,
  Clock,
  UserRound,
  BarChart3,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
// Import localized constants through hooks
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/services.css"; // Will keep using the same CSS file
import {
  useCompanyInfo,
  useServices,
  useLocalizedConstants,
} from "@/hooks/useLocalizedConstants";
import { Service } from "@/types/types";

// Icon mapping for service icons
const iconMap: Record<string, React.ElementType> = {
  BriefcaseIcon: Briefcase,
  Clock,
  UserRound,
  BarChart3,
  DollarSign,
  CheckCircle2,
};

// Service card component
interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = iconMap[service.icon as keyof typeof iconMap];

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
      {/* Glowing effect */}
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-8 h-full flex flex-col">
        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-blue/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
              {t(service.title)}
            </h3>
            <div className="w-12 h-1 bg-gradient-to-r from-brand-orange to-brand-orange/80 rounded-full group-hover:w-20 transition-all duration-300"></div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
          {t(service.description)}
        </p>

        {/* Positions Toggle */}
        {service.positions && service.positions.length > 0 && (
          <div className="mt-auto">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-brand-blue hover:text-brand-orange font-medium mb-4 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {t("View Positions")} ({service.positions.length})
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3">
                {service.positions.map((position, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {t(position)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Corner dots */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute top-0 left-0 h-[3px] w-[3px] bg-brand-orange rounded-full"></div>
        <div className="absolute top-0 right-0 h-[3px] w-[3px] bg-brand-orange rounded-full"></div>
        <div className="absolute bottom-0 left-0 h-[3px] w-[3px] bg-brand-orange rounded-full"></div>
        <div className="absolute bottom-0 right-0 h-[3px] w-[3px] bg-brand-orange rounded-full"></div>
      </div>
    </div>
  );
};

const OurApproachPage = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const services = useServices();
  const constants = useLocalizedConstants();

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: servicesRef, inView: servicesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: frameworkRef, inView: frameworkInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <Helmet>
        <title>{`${t("Services")} | ${companyInfo.name}`}</title>
        <meta
          name="description"
          content={t(
            "We provide tailored hospitality staffing services to meet your specific needs, whether you are seeking talent or opportunities."
          )}
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
              {t("TAILORED SOLUTIONS")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("Premium Staffing Solutions")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t(
                "We provide tailored hospitality staffing services to meet your specific needs, whether you are seeking talent or opportunities."
              )}
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
              {t("TAILORED SOLUTIONS")}
            </motion.span>

            <motion.h2
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {t("Premium Staffing Solutions")}
            </motion.h2>

            <motion.div
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={{
                hidden: { width: "0%", opacity: 0 },
                visible: {
                  width: "80px",
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
                },
              }}
              className="h-1 bg-brand-orange mx-auto rounded-full"
            ></motion.div>

            <motion.p
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
            >
              {t(
                "We provide tailored hospitality staffing services to meet your specific needs, whether you are seeking talent or opportunities."
              )}
            </motion.p>
          </div>

          <motion.div
            ref={servicesRef}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3,
                },
              },
            }}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="container mx-auto px-4 w-full"
          >
            {/* Premium Featured Services - Side by Side */}
            <div className="flex flex-col md:flex-row gap-8 mb-16 w-full max-w-5xl mx-auto justify-center">
              {services.slice(0, 2).map((service, index) => (
                <motion.div
                  key={service.id}
                  variants={fadeInUpVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full w-full md:w-1/2 flex-1"
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-full group transform transition-all duration-500">
                    {/* Simple border glow effect instead of GlowingEffect component */}
                    <div className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-2xl border-2 border-brand-orange shadow-[0_0_15px_rgba(255,128,0,0.5)] service-card-glow"></div>
                    </div>

                    {/* Corner dots with animation */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute top-0 left-0 h-[4px] w-[4px] bg-brand-orange rounded-full group-hover:animate-pulse"></div>
                      <div className="absolute top-0 right-0 h-[4px] w-[4px] bg-brand-orange rounded-full group-hover:animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 h-[4px] w-[4px] bg-brand-orange rounded-full group-hover:animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 h-[4px] w-[4px] bg-brand-orange rounded-full group-hover:animate-pulse"></div>
                    </div>

                    {/* Card Content with improved spacing and hierarchy */}
                    <div className="p-8 h-full flex flex-col">
                      {/* Service Title with animated underline */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-brand-orange mb-3 group-hover:translate-x-1 transition-transform duration-300">
                          {service.title}
                        </h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-orange/50 rounded-full group-hover:w-32 transition-all duration-500 ease-out"></div>
                      </div>

                      {/* Description - Using localized constants */}
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {index === 0
                          ? constants.long_term_talents_description
                          : constants.seasonal_talents_description}
                      </p>

                      {/* Collapsible Positions List with improved styling */}
                      <div className="flex-grow">
                        {(() => {
                          // Using useState hook for each card's expanded state
                          const [isExpanded, setIsExpanded] = useState(false);
                          const positions = service.positions || [];
                          const constants = useLocalizedConstants();

                          return (
                            <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-100">
                              {/* Only show the positions list when expanded */}
                              {isExpanded && (
                                <>
                                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                                    {constants.available_positions}
                                  </h4>

                                  <ul className="space-y-2.5">
                                    {positions.map((position, idx) => {
                                      // Define a mapping function to get the position text based on the key
                                      const getPositionText = (
                                        key: string
                                      ): string => {
                                        switch (key) {
                                          case "position_housekeeping_leadership_long":
                                            return constants.position_housekeeping_leadership_long as string;
                                          case "position_housekeeping_attendants":
                                            return constants.position_housekeeping_attendants as string;
                                          case "position_laundry":
                                            return constants.position_laundry as string;
                                          case "position_food_beverage_long":
                                            return constants.position_food_beverage_long as string;
                                          case "position_stewarding":
                                            return constants.position_stewarding as string;
                                          case "position_convention_services":
                                            return constants.position_convention_services as string;
                                          case "position_culinary":
                                            return constants.position_culinary as string;
                                          case "position_maintenance":
                                            return constants.position_maintenance as string;
                                          case "position_housekeeping_leadership_seasonal":
                                            return constants.position_housekeeping_leadership_seasonal as string;
                                          case "position_food_beverage_seasonal":
                                            return constants.position_food_beverage_seasonal as string;
                                          default:
                                            return position; // Fallback to the key itself
                                        }
                                      };

                                      // Get the position text
                                      const positionText =
                                        getPositionText(position);

                                      return (
                                        <li
                                          key={idx}
                                          className="flex items-start gap-2.5 group/item"
                                        >
                                          <div className="text-brand-blue font-bold">
                                            •
                                          </div>
                                          <span className="text-gray-700 group-hover/item:text-brand-blue transition-colors duration-300">
                                            {positionText}
                                          </span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </>
                              )}

                              {/* Always show the button */}
                              <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-sm text-brand-blue hover:text-brand-orange transition-colors flex items-center gap-1 focus:outline-none"
                              >
                                <span>
                                  {isExpanded
                                    ? (constants.show_less as string)
                                    : (constants.show_more as string)}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Services */}
            {services.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(2).map((service) => (
                  <motion.div key={service.id} variants={fadeInUpVariants}>
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 'View All Services' link removed since user is already on the services page */}
        </div>
      </section>

      {/* Framework Section */}
      <motion.div
        ref={frameworkRef}
        initial={{ opacity: 0 }}
        animate={frameworkInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FrameworkSection />
      </motion.div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="py-20 bg-brand-blue text-white"
      >
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("Ready to Elevate Your Hospitality Career or Team?")}
            </h2>
            <p className="text-xl text-white/90 mb-10">
              {t(
                "Whether you are seeking premium hospitality opportunities or looking to build your dream team, BOH Concepts delivers tailored solutions to meet your specific needs."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 bg-transparent"
              >
                <a
                  href="https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=8d9ee166-cbd6-4856-812a-036cba2c60b6&ccId=19000101_000001&lang=en_US"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Find Opportunities")}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
              >
                <Link to="/contact">{t("Hire Top Talent")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default OurApproachPage;
