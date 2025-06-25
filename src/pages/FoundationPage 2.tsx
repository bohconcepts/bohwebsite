import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Droplet, Shirt, DollarSign, Users, Check, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyInfo } from '@/hooks/useLocalizedConstants';

// Import CSS for the foundation page
import '../styles/foundation.css';

// Note: Header and Footer are automatically included by the Layout component
// in src/components/layout/Layout.tsx which wraps all non-admin routes

const FoundationPage: React.FC = () => {
  // Get language and company info for SEO
  const { language } = useLanguage();
  const companyInfo = useCompanyInfo();
  
  // Animation variants
  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Intersection observer hooks for animation triggers
  const { ref: missionRef } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: servicesRef, inView: servicesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: storiesRef, inView: storiesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: helpRef, inView: helpInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Success stories carousel
  const [activeStory, setActiveStory] = React.useState(0);
  const successStories = [
    {
      quote: "The BOH Foundation scholarship changed my life. I was able to complete my education and now I'm working as a software engineer, giving back to my community.",
      name: "Sarah Johnson",
      location: "Accra, Ghana",
      image: "/images/foundation/story1.jpg"
    },
    {
      quote: "Access to clean water was a daily struggle for our village. The borehole provided by BOH Foundation has transformed our community's health and prosperity.",
      name: "Emmanuel Osei",
      location: "Kumasi, Ghana",
      image: "/images/foundation/story2.jpg"
    },
    {
      quote: "The financial aid program helped me start my small business. Now I employ five people from my neighborhood and can provide for my family.",
      name: "Ama Mensah",
      location: "Tamale, Ghana",
      image: "/images/foundation/story3.jpg"
    }
  ];

  const nextStory = () => {
    setActiveStory((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
  };



  return (
    <>
      <Helmet>
        <title>BOH Foundation | {companyInfo.name}</title>
        <meta name="description" content="The BOH Foundation is dedicated to uplifting marginalized communities through education, clean water, clothing, and financial assistance programs." />
      </Helmet>

      {/* Hero Section with Video Background */}
      <div className="relative h-[70vh] overflow-hidden bg-gray-900 text-white">
        {/* Video Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/images/foundation/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="container relative z-20 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-brand-orange text-white px-4 py-2 rounded-md text-sm font-semibold mb-6 uppercase tracking-wider">
              BOH FOUNDATION
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Empowering Lives, Building Hope
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              {language === "en" ? "Supporting minorities through education, clean water, clothing, and financial assistance programs to create sustainable change and brighter futures." :
               language === "fr" ? "Soutenir les minorités grâce à des programmes d'éducation, d'eau potable, de vêtements et d'aide financière pour créer un changement durable et un avenir meilleur." :
               "Apoyando a las minorías a través de programas de educación, agua potable, ropa y asistencia financiera para crear un cambio sostenible y un futuro más brillante."}
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a 
                href="#mission" 
                className="bg-brand-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Our Mission
                <Award className="ml-2 h-5 w-5" />
              </motion.a>
              <motion.a 
                href="#mission" 
                className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Get Involved
                <Heart className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corporate Mission Section */}
      <section id="mission" className="py-20 bg-white" ref={missionRef}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-0.5 w-12 bg-brand-orange mr-4"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                Foundation Mission
              </h2>
              <div className="h-0.5 w-12 bg-brand-orange ml-4"></div>
            </div>
            
            <p className="text-xl text-gray-700 text-center mb-12">
              The BOH Foundation is dedicated to uplifting marginalized communities by providing essential resources, 
              educational opportunities, and financial support. We believe in creating sustainable solutions that 
              empower individuals to overcome systemic barriers and achieve their full potential with dignity and hope.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border-t-4 border-brand-blue hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-blue/10 p-3 rounded-full inline-flex mb-6">
                  <Award className="text-brand-blue w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Our Foundation Mission</h3>
                <p className="text-gray-700">
                  At BOH Foundation, we are committed to creating sustainable change through targeted programs that address the most pressing needs of underserved communities.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border-t-4 border-brand-orange hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-orange/10 p-3 rounded-full inline-flex mb-6">
                  <Users className="text-brand-orange w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Community Impact</h3>
                <p className="text-gray-700">
                  We measure our success by the tangible improvements in quality of life, educational outcomes, and economic opportunities for the communities we serve.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border-t-4 border-green-500 hover:shadow-md transition-shadow"
              >
                <div className="bg-green-500/10 p-3 rounded-full inline-flex mb-6">
                  <Check className="text-green-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Sustainability Goals</h3>
                <p className="text-gray-700">
                  Our initiatives are designed with long-term sustainability in mind, empowering communities to maintain and build upon the progress we help initiate.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50" ref={servicesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-md text-sm font-semibold mb-6 inline-block">
              OUR PROGRAMS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              What We Do
            </h2>
            <div className="h-1 w-20 bg-brand-earth mx-auto mt-6"></div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-brand-blue" 
              variants={itemVariants}
            >
              <div className="bg-brand-blue/10 p-4 rounded-full inline-flex mb-6 w-16 h-16 items-center justify-center">
                <BookOpen className="text-brand-blue w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Education</h3>
              <p className="text-gray-700">
                Providing scholarships and educational resources to help minorities access quality education and build brighter futures.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-brand-earth" 
              variants={itemVariants}
            >
              <div className="bg-brand-earth/10 p-4 rounded-full inline-flex mb-6 w-16 h-16 items-center justify-center">
                <Droplet className="text-brand-earth w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Clean Water</h3>
              <p className="text-gray-700">
                Installing water purification systems and wells in underserved communities to ensure access to clean, safe drinking water.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-brand-orange" 
              variants={itemVariants}
            >
              <div className="bg-brand-orange/10 p-4 rounded-full inline-flex mb-6 w-16 h-16 items-center justify-center">
                <Shirt className="text-brand-orange w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Clothing</h3>
              <p className="text-gray-700">
                Distributing clothing to those in need, including professional attire for job seekers and everyday essentials for families.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-600" 
              variants={itemVariants}
            >
              <div className="bg-green-100 p-4 rounded-full inline-flex mb-6 w-16 h-16 items-center justify-center">
                <DollarSign className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Financial Aid</h3>
              <p className="text-gray-700">
                Offering microloans, business grants, and financial literacy training to help individuals achieve economic independence.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-brand-blue-dark" id="success-stories" ref={storiesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-white/10 text-white px-3 py-1 rounded-md text-sm font-medium">
                SUCCESS STORIES
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Lives We've Transformed
            </h2>
            
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Real stories from real people whose lives have been changed through our programs.
            </p>
          </div>
          
          <motion.div 
            className="relative max-w-5xl mx-auto"
            variants={fadeInUpVariants}
            initial="hidden"
            animate={storiesInView ? "visible" : "hidden"}
          >
            <div className="carousel-container">
              <div className="story-card">
                <div className="story-image">
                  <img src={successStories[activeStory].image} alt={successStories[activeStory].name} />
                </div>
                <div className="story-content">
                  <blockquote>"{successStories[activeStory].quote}"</blockquote>
                  <div className="story-author">
                    <p className="author-name">{successStories[activeStory].name}</p>
                    <p className="author-location">{successStories[activeStory].location}</p>
                  </div>
                </div>
              </div>
              
              <div className="carousel-controls">
                <button 
                  onClick={prevStory} 
                  className="carousel-button prev"
                  aria-label="Previous story"
                  title="View previous success story"
                >
                  &larr;
                </button>
                <div className="carousel-indicators">
                  {successStories.map((_, index) => (
                    <button 
                      key={index}
                      className={`indicator ${index === activeStory ? 'active' : ''}`}
                      onClick={() => setActiveStory(index)}
                      aria-label={`View story ${index + 1}`}
                      title={`View success story ${index + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextStory} 
                  className="carousel-button next"
                  aria-label="Next story"
                  title="View next success story"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Help Section */}
      <section className="help-section" ref={helpRef}>
        <div className="container">
          <h2 className="section-title">How to Help</h2>
          <div className="section-divider"></div>
          
          <motion.div 
            className="help-options"
            variants={staggerContainerVariants}
            initial="hidden"
            animate={helpInView ? "visible" : "hidden"}
          >
            <motion.div className="help-card" variants={itemVariants}>
              <Heart size={32} />
              <h3>Donate</h3>
              <p>Your financial contribution directly supports our programs and the communities we serve.</p>
              <Button className="help-button">Make a Donation</Button>
            </motion.div>
            
            <motion.div className="help-card" variants={itemVariants}>
              <Users size={32} />
              <h3>Volunteer</h3>
              <p>Join our team of dedicated volunteers and make a hands-on difference in people's lives.</p>
              <Button className="help-button" variant="outline">Join Our Team</Button>
            </motion.div>
            
            <motion.div className="help-card" variants={itemVariants}>
              <Users size={32} />
              <h3>Partner With Us</h3>
              <p>Organizations and businesses can amplify our impact through strategic partnerships.</p>
              <Button className="help-button" variant="outline">Contact Us</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>


    </>
  );
};

export default FoundationPage;
