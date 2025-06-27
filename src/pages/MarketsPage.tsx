import React from 'react';
import { motion, Variants, easeOut } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import GlobalWorkforceMap from '../components/sections/GlobalWorkforceMap';
import '../styles/markets.css'; // Import the CSS file we'll create


const MarketsPage: React.FC = () => {
  const { t } = useLanguage();
  // Animation variants for sections
  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut }
    }
  };

  // Animation variants for staggered fade-in
  const fadeInAnimationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
        duration: 0.5
      }
    })
  };

  // Intersection observer hooks for animation triggers
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: industriesRef, inView: industriesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: locationsRef, inView: locationsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Define types for location data
  type StateInfo = {
    state: string;
    cities: string;
  };

  type Location = {
    id: number;
    name: string;
    cities?: string;
    states?: StateInfo[];
  };
  
  // State to track expanded states
  const [expandedStates, setExpandedStates] = React.useState<string[]>([]);
  
  // Toggle state expansion
  const toggleState = (stateKey: string) => {
    if (expandedStates.includes(stateKey)) {
      setExpandedStates(expandedStates.filter(key => key !== stateKey));
    } else {
      setExpandedStates([...expandedStates, stateKey]);
    }
  };

  // Data for the page with images, names, and descriptions
  const industries = [
    { 
      id: 1, 
      name: t("industry_hotels_resorts"), 
      image: "/images/industries/hotels-resorts.jpg",
      description: t("industry_hotels_resorts_desc") || "Luxury hotels and resorts worldwide seeking top hospitality talent for exceptional guest experiences."
    },
    { 
      id: 2, 
      name: t("industry_safari_lodges"), 
      image: "/images/industries/safari.jpg",
      description: t("industry_safari_lodges_desc") || "Exclusive safari lodges and wilderness retreats requiring specialized hospitality professionals."
    },
    { 
      id: 3, 
      name: t("industry_restaurants"), 
      image: "/images/industries/restaurants.jpg",
      description: t("industry_restaurants_desc") || "Fine dining establishments and restaurant groups seeking culinary and service excellence."
    },
    { 
      id: 4, 
      name: t("industry_conference_centers"), 
      image: "/images/industries/convention.jpg",
      description: t("industry_conference_centers_desc") || "Conference and event centers requiring skilled staff for seamless event execution."
    },
    { 
      id: 5, 
      name: t("industry_cruise"), 
      image: "/images/industries/cruise.jpg",
      description: t("industry_cruise_desc") || "Cruise lines seeking hospitality professionals for exceptional onboard guest experiences."
    },
    { 
      id: 6, 
      name: t("industry_airlines"), 
      image: "/images/industries/airlines.jpg",
      description: t("industry_airlines_desc") || "Airlines requiring cabin crew and hospitality staff focused on passenger comfort and service."
    }
  ];

  const locations: Location[] = [
    { 
      id: 1, 
      name: "United States", 
      states: [
        { state: "Maryland", cities: "Cambridge" },
        { state: "Hawaii", cities: "Maui, Kauai" },
        { state: "Washington", cities: "Bellevue, Seattle, Renton" },
        { state: "Oregon", cities: "Portland" },
        { state: "Vermont", cities: "Stowe" }
      ]
    },
    { 
      id: 2, 
      name: "Ghana", 
      states: [
        { state: "Greater Accra Region", cities: "Accra" },
        { state: "Ashanti Region", cities: "Kumasi" }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("markets_page_title")} | BOH Concepts</title>
        <meta name="description" content={t("markets_meta_description")} />
      </Helmet>

      {/* Hero Section */}
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
              {t("markets_hero_tag") || "GLOBAL MARKETS"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase mb-6">
              {t("markets_hero_title") || "Global Hospitality Market"}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {t("markets_hero_subtitle") || "Connecting exceptional hospitality talent with premier properties across global markets."}
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
              {t("markets_section_tag") || "OUR INDUSTRIES"}
            </motion.span>
            
            <motion.h2 
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-4xl md:text-5xl uppercase text-gray-900 mb-4"
            >
              {t("markets_section_title") || "Industries We Serve"}
            </motion.h2>
            
            <motion.div 
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={{
                hidden: { width: "0%", opacity: 0 },
                visible: {
                  width: "80px",
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.4, ease: easeOut }
                }
              }}
              className="h-1 bg-brand-orange mx-auto rounded-full"
            ></motion.div>
            
            <motion.p
              initial="hidden"
              animate={titleInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
            >
              {t("markets_section_description") || "We provide exceptional staffing solutions across diverse hospitality sectors, ensuring the right talent for your specific industry needs."}
            </motion.p>
          </div>

          <div ref={industriesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              animate={industriesInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
              } as Variants}
              className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-orange hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">End-to-End Recruitment Services</h3>
              <p className="text-gray-600">
                From entry-level hotel staff to executive hospitality managers, we provide customized recruitment solutions tailored to the unique characteristics of global markets. We carefully match candidates based on cultural fit, skill set, and a commitment to service excellence.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={industriesInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: easeOut } }
              } as Variants}
              className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-blue hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">On-the-Ground Expertise</h3>
              <p className="text-gray-600">
                With local recruitment partners and sourcing teams positioned across the globe, we have a profound understanding of the unique hiring needs, labor regulations, and market dynamics that characterize each country.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={industriesInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4, ease: easeOut } }
              } as Variants}
              className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-orange hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Multilingual Talent Pool</h3>
              <p className="text-gray-600">
                We actively recruit talent who are fluent in multiple languages, including English, French, Spanish, Arabic, Portuguese, Mandarin, and more, ensuring that hospitality businesses can confidently serve diverse international clientele.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Africa Chooses Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-brand-orange font-medium mb-3">
              {t("markets_why_tag")}
            </span>
            <h2 className="text-3xl md:text-4xl uppercase text-gray-900 mb-4">
              {t("markets_why_title")}
            </h2>
            <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 border-l-4 border-brand-blue"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{t("markets_why_1_title")}</h3>
              <p className="text-gray-600">{t("markets_why_1_description")}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 border-l-4 border-brand-orange"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{t("markets_why_2_title")}</h3>
              <p className="text-gray-600">{t("markets_why_2_description")}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 border-l-4 border-brand-blue"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{t("markets_why_3_title")}</h3>
              <p className="text-gray-600">{t("markets_why_3_description")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Workforce Map */}
      <GlobalWorkforceMap />

      {/* Industries We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-brand-orange font-medium mb-3">
              {t("markets_industries_tag")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("markets_industries_title")}
            </h2>
            <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              {t("markets_industries_description") || "We provide specialized staffing solutions for various sectors within the hospitality industry, connecting top talent with premium opportunities."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={industry.image} 
                    alt={industry.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{industry.name}</h3>
                  <p className="text-gray-600 flex-grow">{industry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block text-brand-orange font-medium mb-3"
            >
              {t("markets_locations_tag") || "AREAS OF OPERATION"}
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {t("markets_locations_title") || "Where We Operate"}
            </motion.h2>
            
            <motion.div
              initial={{ width: "0%", opacity: 0 }}
              whileInView={{ width: "80px", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
              viewport={{ once: true }}
              className="h-1 bg-brand-orange mx-auto rounded-full mb-6"
            ></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col"
            >
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t("markets_why_1_title") || "Industry Expertise"}</h3>
              <p className="text-gray-600">{t("markets_why_1_description") || "Our team brings decades of hospitality experience across diverse markets and property types."}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col"
            >
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t("markets_why_2_title") || "Global Network"}</h3>
              <p className="text-gray-600">{t("markets_why_2_description") || "Access to our extensive network of qualified hospitality professionals across international markets."}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col"
            >
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t("markets_why_3_title") || "Customized Solutions"}</h3>
              <p className="text-gray-600">{t("markets_why_3_description") || "Tailored staffing approaches designed to meet the unique needs of each property and market."}</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Areas of Operation */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div ref={locationsRef} className="text-center mb-12">
            <motion.span
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="inline-block text-brand-orange font-medium mb-3"
            >
              {t("markets_locations_tag")}
            </motion.span>
            
            <motion.h2
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {t("markets_locations_title")}
            </motion.h2>
            
            <motion.div
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={{
                hidden: { width: "0%", opacity: 0 },
                visible: {
                  width: "80px",
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.4, ease: easeOut }
                }
              } as Variants}
              className="h-1 bg-brand-orange mx-auto rounded-full mb-6"
            ></motion.div>
            
            <motion.p
              initial="hidden"
              animate={locationsInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="max-w-2xl mx-auto text-gray-600 mb-10"
            >
              {t("markets_locations_description")}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 max-w-4xl mx-auto">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="col-span-1"
              >
                <div className="mb-4 pb-2 border-b-2 border-brand-orange">
                  <h3 className="text-xl font-bold text-brand-blue flex items-center">
                    {location.name}
                  </h3>
                </div>
                
                {location.states ? (
                  <div className="space-y-3">
                    {location.states.map((stateInfo, stateIndex) => {
                      const stateKey = `${location.id}-${stateIndex}`;
                      const isExpanded = expandedStates.includes(stateKey);
                      
                      return (
                        <div key={stateIndex} className="border-b border-gray-100 overflow-hidden">
                          <button 
                            onClick={() => toggleState(stateKey)}
                            className="w-full text-left px-1 py-2 flex items-center justify-between hover:text-brand-orange transition-colors duration-200"
                          >
                            <h4 className="font-medium">{stateInfo.state}</h4>
                            <div className="flex items-center text-brand-orange">
                              {isExpanded ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="py-2 pl-5"
                            >
                              <ul className="space-y-2">
                                {stateInfo.cities.split(", ").map((city, cityIndex) => (
                                  <li key={cityIndex} className="text-gray-600 hover:text-brand-orange transition-colors">
                                    <Link to="/contact" className="inline-block hover:underline">{city}</Link>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {location.cities?.split(", ").map((city, cityIndex) => (
                      <li key={cityIndex} className="text-gray-600 hover:text-brand-orange transition-colors">
                        <Link to="/contact" className="inline-block hover:underline">{city}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              <span>Contact Our Corporate Office</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>




    </>
  );
};

export default MarketsPage;
