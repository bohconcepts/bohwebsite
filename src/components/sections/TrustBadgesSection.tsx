import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import BBBAccreditationBadge from '@/components/badges/BBBAccreditationBadge';

/**
 * TrustBadgesSection Component
 * Displays trust badges and accreditations to build credibility
 */
const TrustBadgesSection: React.FC = () => {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <section ref={ref} className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {inView && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="section-title-container">
              <h2 className="section-title">
                {t('Trusted & Accredited')}
              </h2>
              <div className="section-title-underline"></div>
              <p className="section-title-description">
                {t('We are proud to maintain the highest standards of service and business ethics')}
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center items-center gap-8"
            >
              <div className="flex flex-col items-center">
                <BBBAccreditationBadge size="lg" />
                <p className="mt-3 text-sm text-gray-600 max-w-xs text-center">
                  {t('BBB Accredited Business with A+ Rating')}
                </p>
              </div>
              
              {/* Additional trust badges can be added here in the future */}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TrustBadgesSection;
