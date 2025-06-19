import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CtaSection = () => {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  return (
    <>
      {/* Images Row Above CTA */}
      <div className="container mx-auto px-4 -mb-16 relative z-10">
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-4 max-w-4xl w-full">
            <motion.div 
              custom={0}
              variants={imageVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="aspect-square overflow-hidden rounded-lg shadow-lg"
            >
              <img 
                src="/images/cta/hospitality-student-1.jpg" 
                alt="Hospitality Student" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div 
              custom={1}
              variants={imageVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="aspect-square overflow-hidden rounded-lg shadow-lg"
            >
              <img 
                src="/images/cta/hospitality-group-2.jpg" 
                alt="Hospitality Group" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div 
              custom={2}
              variants={imageVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="aspect-square overflow-hidden rounded-lg shadow-lg"
            >
              <img 
                src="/images/cta/hospitality-team-3.jpg" 
                alt="Hospitality Team" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <section ref={ref} className="section-padding primary-gradient">
        <motion.div 
          className="container"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="flex flex-col items-center justify-center pt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('Ready to Elevate Your Hospitality Career or Team?')}
            </h2>
            <p className="text-white/90 text-lg mb-8">
              {t('Whether you are seeking premium hospitality opportunities or looking to build your dream team, BOH Concepts delivers tailored solutions to meet your specific needs.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-orange text-white border-2 border-brand-orange hover:bg-white hover:text-brand-orange transition-colors">
              <a
              href="https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=8d9ee166-cbd6-4856-812a-036cba2c60b6&ccId=19000101_000001&lang=en_US"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Find Opportunities")}
            </a>
              </Button>

            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default CtaSection;
