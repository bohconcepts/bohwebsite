import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const Hero = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Carousel slides configuration
  const slides = [
    {
      image: "/images/hero/services.png",
      title: t('Professional Hospitality Services'),
      subtitle: t('Elevating guest experiences with our premium staffing solutions')
    },
    {
      image: "/images/hero/clients.jpg",
      title: t('Trusted by Industry Leaders'),
      subtitle: t('Partnering with top hotels and resorts across the nation')
    },
    {
      image: "/images/hero/pricing.png",
      title: t('Transparent & Competitive Pricing'),
      subtitle: t('Cost-effective staffing solutions tailored to your needs')
    },
    {
      image: "/images/hero/process.png",
      title: t('Streamlined Recruitment Process'),
      subtitle: t('From selection to onboarding, we handle every step with care')
    }
  ];
  
  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {/* Commented out video
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-[1.1] contrast-[1.1]"
        >
          <source src="/images/hero/main.mp4" type="video/mp4" />
          <img
            src="/images/hero/hero1.jpg"
            alt="BOH Concepts Hotel Background"
            className="w-full h-full object-cover"
          />
        </video>
        */}
        
        {/* Carousel Images */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 overflow-hidden ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={`BOH Concepts - ${index + 1}`}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full max-w-none min-w-full object-center brightness-110 contrast-110 saturate-110"
              />
            </div>
          </div>
        ))}

        
        {/* Ultra-light overlay just for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 via-brand-blue/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3"
          >
            <span className="bg-brand-orange text-white px-3 py-1 rounded-md text-sm font-medium">
              {t('A TRUSTED PARTNER')}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)' }}
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white text-lg mb-8 max-w-2xl font-medium"
            style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
          >
            {slides[currentSlide].subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
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
                {t('Join Our Team')}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              <Link to="/our-approach">{t('Our Approach')}</Link>
            </Button>
          </motion.div>
          
          {/* Carousel Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mt-8 gap-2"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-brand-orange w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
