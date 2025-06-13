import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/about.css";
import { useCompanyInfo, useCompanyValues, useTeamMembers } from "@/hooks/useLocalizedConstants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Users, Award, Eye, Heart } from "lucide-react";

const About = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const companyValues = useCompanyValues();
  const teamMembers = useTeamMembers();

  return (
    <>
      <Helmet>
        <title>{t("About Us")} | {companyInfo.name}</title>
        <meta
          name="description"
          content={t("about_meta_description")}
        />
      </Helmet>

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
              {t('ABOUT US')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transforming <span className="text-brand-orange">Hospitality</span>{" "}
              Through <span className="text-brand-orange">Excellence</span>
            </h1>
            {/* <p className="text-xl text-white/90 max-w-2xl">
              {t("about_heading")}
            </p> */}
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Tabs defaultValue="about" className="w-full">
              <div className="border-b overflow-x-auto">
                <TabsList className="flex md:justify-between h-auto min-h-16 bg-white p-0 w-full max-w-none">
                  <TabsTrigger
                    value="about"
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-4 h-full whitespace-nowrap data-[state=active]:border-b-2 data-[state=active]:border-brand-orange data-[state=active]:text-brand-orange rounded-none flex-1 md:flex-none`}
                  >
                    <Info size={16} className="hidden sm:inline" />
                    <span className="text-sm sm:text-base">{t("about_tab")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mission"
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-4 h-full whitespace-nowrap data-[state=active]:border-b-2 data-[state=active]:border-brand-orange data-[state=active]:text-brand-orange rounded-none flex-1 md:flex-none`}
                  >
                    <Award size={16} className="hidden sm:inline" />
                    <span className="text-sm sm:text-base">{t("mission_tab")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="values"
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-4 h-full whitespace-nowrap data-[state=active]:border-b-2 data-[state=active]:border-brand-orange data-[state=active]:text-brand-orange rounded-none flex-1 md:flex-none`}
                  >
                    <Heart size={16} className="hidden sm:inline" />
                    <span className="text-sm sm:text-base">{t("values_tab")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-4 h-full whitespace-nowrap data-[state=active]:border-b-2 data-[state=active]:border-brand-orange data-[state=active]:text-brand-orange rounded-none flex-1 md:flex-none`}
                  >
                    <Users size={16} className="hidden sm:inline" />
                    <span className="text-sm sm:text-base">{t("team_tab")}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="p-0">
                {/* Full-width video section at the top */}
                <div className="w-full relative overflow-hidden video-container">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="w-full h-full"
                  >
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    >
                      <source src="/videos/about/bohcelebrations.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* <div className="absolute bottom-6 right-6 bg-brand-orange text-white px-4 py-2 rounded-md text-base font-medium shadow-lg">
                      BOH Celebrations
                    </div> */}
                  </motion.div>
                </div>
                
                {/* Content section below the video */}
                <div className="container mx-auto px-4 py-8 sm:py-12">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
                      {t("about_section_heading")}
                    </h2>
                    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md">
                      <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                        {t("about_paragraph_1")}
                      </p>
                      <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                        {t("about_paragraph_2")}
                      </p>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                        {t("about_paragraph_3")}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mission" className="p-4 sm:p-8 about-tab-content">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 text-center relative"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-blue">
                      {t("mission_heading")}
                    </span>
                    <div className="w-24 h-1 bg-brand-orange mx-auto mt-4 rounded-full"></div>
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="relative overflow-hidden"
                    >
                      <div className="bg-gradient-to-br from-brand-blue to-brand-blue/90 p-5 sm:p-8 rounded-xl text-white shadow-lg h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                        <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-brand-orange/20 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 rounded-full bg-brand-orange/10 blur-2xl"></div>

                        <div className="relative z-10">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 hover:bg-white/20 transition-all duration-300 about-icon-container">
                            <motion.div
                              initial={{ rotate: -10, scale: 0.9 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              <Award className="w-8 h-8 text-brand-orange hover:scale-110 transition-transform duration-300" />
                            </motion.div>
                          </div>

                          <h3 className="text-2xl font-bold mb-4 text-white hover:text-white/80 transition-colors duration-300 about-heading">
                            {t("mission_title")}
                          </h3>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="text-white/90 leading-relaxed about-text"
                          >
                            {t("mission_description")}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="relative overflow-hidden"
                    >
                      <div className="bg-gradient-to-br from-brand-orange to-brand-orange/90 p-8 rounded-xl text-white shadow-lg h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                        <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-brand-blue/20 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 rounded-full bg-brand-blue/10 blur-2xl"></div>

                        <div className="relative z-10">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 hover:bg-white/20 transition-all duration-300 about-icon-container">
                            <motion.div
                              initial={{ rotate: 10, scale: 0.9 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                            >
                              <Eye className="w-8 h-8 text-white hover:scale-110 transition-transform duration-300" />
                            </motion.div>
                          </div>

                          <h3 className="text-2xl font-bold mb-4 text-white hover:text-white/80 transition-colors duration-300 about-heading">
                            {t("vision_title")}
                          </h3>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="text-white/90 text-lg leading-relaxed"
                          >
                            {t("vision_description")}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="values" className="p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4"
                >
                  <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    {t("values_heading")}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {companyValues.map((value: { id: string; title: string; description: string }, index: number) => (
                      <motion.div
                        key={value.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group overflow-hidden">
                          <CardHeader>
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1 + 0.3,
                              }}
                            >
                              <CardTitle className="text-xl text-brand-orange flex items-center group-hover:translate-x-1 transition-transform duration-300">
                                <span className="inline-block w-8 h-8 bg-brand-orange text-white rounded-full mr-2 flex items-center justify-center text-sm">
                                  {index + 1}
                                </span>
                                {value.title}
                              </CardTitle>
                            </motion.div>
                          </CardHeader>
                          <CardContent>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.1 + 0.5,
                              }}
                              className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300"
                            >
                              {value.description}
                            </motion.p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="team" className="p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold mb-10 text-center"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-orange">
                      Meet The Team
                    </span>
                    <div className="w-24 h-1 bg-brand-orange mx-auto mt-4 rounded-full"></div>
                  </motion.h2>

                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {teamMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        variants={{
                          hidden: { opacity: 0, y: 50 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.5,
                              ease: "easeOut",
                            },
                          },
                        }}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                      >
                        <Card className="border-none shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full mx-auto max-w-xs w-full">
                          <div className="relative h-64 overflow-hidden group">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover transition-all duration-500"
                              />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                {member.bio}
                              </p>
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-brand-orange">
                              {member.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 text-sm font-medium mb-3">
                              {member.position}
                            </p>
                            {member.social && (
                              <div className="flex gap-3 mt-2">
                                {member.social.linkedin && (
                                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-blue transition-colors social-link" title="View LinkedIn profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                                    </svg>
                                  </a>
                                )}
                                {member.social.twitter && (
                                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-blue transition-colors social-link" title="View Twitter profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                    </svg>
                                  </a>
                                )}
                                {member.social.instagram && (
                                  <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-blue transition-colors social-link" title="View Instagram profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                                    </svg>
                                  </a>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
