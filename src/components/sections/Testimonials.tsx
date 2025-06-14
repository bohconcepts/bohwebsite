import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue={testimonials.length > 0 ? testimonials[0].id : 'default'} className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-8 justify-center">
              {testimonials.length > 0 ? testimonials.map((testimonial) => (
                <TabsTrigger 
                  key={testimonial.id} 
                  value={testimonial.id} 
                  className="data-[state=active]:bg-brand-orange data-[state=active]:text-white px-3 py-1.5 text-sm whitespace-nowrap flex-grow sm:flex-grow-0">
                  {testimonial.author}
                </TabsTrigger>
              )) : (
                <TabsTrigger value="default">No Testimonials</TabsTrigger>
              )}
            </TabsList>
            
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <TabsContent key={testimonial.id} value={testimonial.id}>
                <Card className="border-none shadow-lg bg-white">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-6">
                      <QuoteIcon className="h-12 w-12 text-brand-orange opacity-20" />
                    </div>
                    <p className="text-center text-lg italic text-gray-700 mb-8">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center pb-6">
                    <Avatar className="h-16 w-16 mb-3">
                      {testimonial.image ? (
                        <AvatarImage src={testimonial.image} alt={testimonial.author} />
                      ) : null}
                      <AvatarFallback className="bg-brand-blue text-white">
                        {testimonial.author?.split(' ')?.map((n) => n[0])?.join('') || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h4 className="font-semibold text-brand-blue">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            )) : (
              <TabsContent value="default">
                <Card className="border-none shadow-lg bg-white">
                  <CardContent className="pt-6 text-center">
                    <p>No testimonials available at this time.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;