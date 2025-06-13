
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Building, DollarSign, Shield } from "lucide-react";

const WhyChooseUs = () => {
  const { t } = useLanguage();
  
  // Create ref for animation
  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
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
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  return (
    <>
      {/* Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* <span className="inline-block font-medium mb-3 text-center text-brand-orange">
              {t("WHY CHOOSE US")}
            </span> */}
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("Why Choose Us")}
            </h2>
          
            <div className="h-1 bg-brand-orange mx-auto w-20 rounded-full mb-6"></div>
          
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
              {t("Discover the advantages of partnering with us for all your hospitality staffing needs.")}
            </p>
          </div>
          <motion.div
            ref={cardsRef}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Card 1 - Our Services */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center h-full"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-brand-orange">
                  <Home className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{t("our_services_card")}</h3>
              <p className="text-gray-600 text-sm text-center">
                {t("our_services_description")}
              </p>
            </motion.div>

            {/* Card 2 - Our Clients */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center h-full"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-brand-orange">
                  <Building className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{t("our_clients_card")}</h3>
              <p className="text-gray-600 text-sm text-center">
                {t("our_clients_description")}
              </p>
            </motion.div>

            {/* Card 3 - Pricing Module */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center h-full"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-brand-orange">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{t("pricing_module_card")}</h3>
              <p className="text-gray-600 text-sm text-center">
                {t("pricing_module_description")}
              </p>
            </motion.div>

            {/* Card 4 - Our Process */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center h-full"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-brand-orange">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{t("our_process_card")}</h3>
              <p className="text-gray-600 text-sm text-center">
                {t("our_process_description")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
