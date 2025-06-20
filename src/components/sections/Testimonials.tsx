import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTestimonials } from '@/hooks/useLocalizedConstants';
import { useLanguage } from '@/contexts/LanguageContext';

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
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('testimonials_title')}</h2>
          <div className="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('testimonials_subtitle')}
          </p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {testimonials.length > 0 ? testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id} 
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.position} {testimonial.company && ` • ${testimonial.company}`}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "{testimonial.content}"
              </p>
            </motion.div>
          )) : (
            <div className="col-span-full text-center">
              <p>No testimonials available at this time.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;