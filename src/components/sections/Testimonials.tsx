import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTestimonials } from '@/hooks/useLocalizedConstants';
import { useLanguage } from '@/contexts/LanguageContext';
import { QuoteIcon } from 'lucide-react';

const Testimonials = () => {
  const { t } = useLanguage();
  const testimonials = useTestimonials() || [];
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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section ref={ref} className="section-padding">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6">{t('testimonials_title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('testimonials_subtitle')}
          </p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.length > 0 ? testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="border-none shadow-lg bg-white h-full flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <div className="flex justify-center mb-6">
                    <QuoteIcon className="h-12 w-12 text-brand-orange opacity-20" />
                  </div>
                  <p className="text-center text-lg italic text-gray-700 mb-8">
                    "{testimonial.content}"
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-center pb-6 border-t pt-6">
                  <div className="mb-4 h-16 w-full flex justify-center">
                    {testimonial.image && (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.company || testimonial.author} 
                        className="h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-brand-blue">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.position} {testimonial.company && `• ${testimonial.company}`}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )) : (
            <Card className="border-none shadow-lg bg-white col-span-full">
              <CardContent className="pt-6 text-center">
                <p>No testimonials available at this time.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;