import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Heart, Calendar, Globe, Users, Check, Award, Briefcase, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const WhoWeArePage: React.FC = () => {
  const { t, language } = useLanguage();
  // We only need company info for the page title
  const companyInfo = useCompanyInfo();

  return (
    <>
      <Helmet>
        <title>
          {t("about_page_title")} | {companyInfo.name}
        </title>
        <meta
          name="description"
          content="Learn about BOH Concepts' commitment to corporate social responsibility through community initiatives, breast cancer awareness, and cultural celebrations."
        />
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
            <source src="/images/hero/main_new.mp4" type="video/mp4" />
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
              {t("about_page_tag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              {t("about_page_title")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              {language === "en" ? "Back of House Concepts connects top hospitality talent with leading properties, backed by decades of industry experience and a commitment to diversity and social responsibility." :
               language === "fr" ? "Back of House Concepts met en relation les meilleurs talents de l'hôtellerie avec des établissements de premier plan, fort d'une expertise de plusieurs décennies dans le secteur et d'un engagement envers la diversité et la responsabilité sociale." :
               "Back of House Concepts conecta a los mejores talentos de la hospitalidad con propiedades líderes, respaldado por décadas de experiencia en la industria y un compromiso con la diversidad y la responsabilidad social."}
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a 
                href="#our-mission" 
                className="bg-brand-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Our Mission
                <Award className="ml-2 h-5 w-5" />
              </motion.a>
              <motion.a 
                href="#initiatives" 
                className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Our Initiatives
                <Globe className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corporate Values Section */}
      <section id="our-mission" className="py-20 bg-white">
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
                Our Corporate Mission
              </h2>
              <div className="h-0.5 w-12 bg-brand-orange ml-4"></div>
            </div>
            
            <p className="text-xl text-gray-700 text-center mb-12">
              At Back of House Concepts, we're committed to excellence in hospitality staffing while embracing diversity and making a positive impact in our communities.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border-t-4 border-brand-blue hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-blue/10 p-3 rounded-full inline-flex mb-6">
                  <Building className="text-brand-blue w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Corporate Excellence</h3>
                <p className="text-gray-700">
                  We deliver exceptional staffing solutions with professionalism, reliability, and attention to detail that elevates hospitality experiences.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border-t-4 border-brand-orange hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-orange/10 p-3 rounded-full inline-flex mb-6">
                  <Users className="text-brand-orange w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Diversity & Inclusion</h3>
                <p className="text-gray-700">
                  We champion diversity in all forms, creating opportunities for underrepresented groups and fostering an inclusive environment across our operations.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border-t-4 border-pink-500 hover:shadow-md transition-shadow"
              >
                <div className="bg-pink-500/10 p-3 rounded-full inline-flex mb-6">
                  <Heart className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Social Responsibility</h3>
                <p className="text-gray-700">
                  We're dedicated to making a positive impact through community engagement, awareness campaigns, and sustainable business practices.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breast Cancer Awareness Initiative */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="inline-block bg-pink-100 p-3 rounded-full mb-4">
              <Heart className="text-pink-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-brand-blue">
              {t("csr_breast_cancer_title")}
            </h2>
            <p className="text-lg mb-4">{t("csr_breast_cancer_description")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">
                Making Strides Against Breast Cancer
              </h3>
              <p className="text-gray-700">
                Our team members volunteer their time and resources to support
                breast cancer research and awareness. Through our partnership
                with the American Cancer Society's Making Strides campaign,
                we have helped raise funds and increase awareness in our
                communities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-pink-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Annual participation in Making Strides walks</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-pink-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Employee-led fundraising initiatives</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-pink-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Awareness campaigns in our partner hotels</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <img
                  src="/images/whoweare/IMG_3370.jpeg"
                  alt="Pink Chair Event"
                  className="w-full h-72 object-cover rounded-lg shadow-md"
                />
                <img
                  src="/images/whoweare/IMG_3422.jpeg"
                  alt="Team Member with Boxing Gloves"
                  className="w-full h-72 object-cover rounded-lg shadow-md"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Black History Month Initiative */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="inline-block bg-orange-100 p-3 rounded-full mb-4">
              <Calendar className="text-orange-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-brand-blue">
              {t("csr_black_history_title")}
            </h2>
            <p className="text-lg mb-4">{t("csr_black_history_description")}</p>
            <p className="text-lg mb-6">{t("about_paragraph_2")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-1"
            >
              <img
                src="/images/whoweare/IMG_5281.jpeg"
                alt="Black History Month Celebration Banner"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 order-2"
            >
              <h3 className="text-2xl font-bold">
                Celebrating Culture & Heritage
              </h3>
              <p className="text-gray-700">
                Our Black History Month celebrations include educational events,
                guest speakers, and cultural showcases that highlight the
                contributions and achievements of Black Americans throughout
                history.
              </p>
              <p className="text-gray-700">
                These initiatives align with our core values of diversity,
                equity, and inclusion, creating opportunities for learning and
                growth across our organization and partner properties.
              </p>
              <div className="pt-4">
                <a
                  href="#"
                  className="inline-flex items-center text-brand-orange font-medium hover:underline"
                >
                  Learn more about our DEI initiatives
                  <Globe className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-gray-700 mb-6">
              Through our corporate social responsibility initiatives, BOH
              Concepts has made a meaningful difference in communities across
              the globe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              variants={fadeInUpVariants}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="text-4xl font-bold text-brand-blue mb-2">
                1500+
              </div>
              <p className="text-gray-700">Volunteer Hours</p>
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="text-4xl font-bold text-brand-blue mb-2">4+</div>
              <p className="text-gray-700">Continents Impacted</p>
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="text-4xl font-bold text-brand-blue mb-2">12</div>
              <p className="text-gray-700">Community Partners</p>
            </motion.div>
          </div>

          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="/partnership"
              className="inline-flex items-center justify-center bg-brand-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Partner With Us
              <Globe className="ml-2 h-5 w-5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-8"
          >
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-brand-blue">
                Our Story
              </h3>
              <p className="text-gray-700">
                BOH Concepts was founded with a vision to transform hospitality
                staffing by bringing together diverse talent from across the
                globe. Our journey began with a simple idea: to create
                meaningful connections between exceptional hospitality
                professionals and world-class establishments.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-brand-orange">
                Our Approach
              </h3>
              <p className="text-gray-700">
                We take a personalized approach to staffing, understanding that
                each client has unique needs and each professional has unique
                talents. By carefully matching the right people with the right
                opportunities, we create partnerships that drive success for
                everyone involved.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default WhoWeArePage;
