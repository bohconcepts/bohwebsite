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

  const testimonialVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6
      }
    })
  };

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="section-title-container mb-16">
          <h2 className="section-title">{t('testimonials_title')}</h2>
          <div className="section-title-underline"></div>
          <p className="section-title-description">
            {t('testimonials_subtitle')}
          </p>
        </div>
        
        {testimonials.length > 0 ? (
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                custom={index}
                variants={testimonialVariants}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="mb-6 flex-grow">
                  <svg className="h-8 w-8 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <blockquote className="text-gray-600 mb-6">
                    {testimonial.content}
                  </blockquote>
                </div>
                <div className="mt-auto">
                  <div className="font-medium text-gray-900">{testimonial.author}</div>
                  <div className="mt-1 text-sm text-gray-500">{testimonial.position}</div>
                  {testimonial.location && (
                    <div className="mt-1 text-sm text-brand-teal font-medium">{testimonial.location}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center">
            <p>No testimonials available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
