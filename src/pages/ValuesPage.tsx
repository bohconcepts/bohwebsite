import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCompanyInfo, useCompanyValues } from "@/hooks/useLocalizedConstants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const ValuesPage = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const companyValues = useCompanyValues();

  return (
    <>
      <Helmet>
        <title>{t("Our Values")} | {companyInfo.name}</title>
        <meta
          name="description"
          content={t("values_meta_description")}
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
              {t('values_page_tag')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase mb-4 text-white">
              {t('values_page_title')}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {t("values_description")}
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4"
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Heart className="text-brand-orange w-8 h-8 mr-3" />
                <h2 className="text-3xl uppercase text-center">
                  <span className={t("values_heading_color")}>COMPANY CORE VALUES</span>
                </h2>
              </div>
              <div className="h-1 w-24 bg-brand-blue mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
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
                  <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group overflow-hidden bg-gradient-to-b from-white to-gray-50">
                    <CardHeader className="pb-2">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1 + 0.3,
                        }}
                      >
                        <CardTitle className="text-xl text-brand-blue font-bold text-center group-hover:text-brand-orange transition-colors duration-300">
                          {value.title}
                        </CardTitle>
                        <div className="h-0.5 w-12 bg-brand-orange mx-auto mt-2"></div>
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
                        className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300 text-center text-sm"
                      >
                        {value.description}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="max-w-3xl mx-auto mt-16 text-center"
            >
              <h3 className="text-2xl uppercase mb-6 text-gray-800">Living Our Values</h3>
              <p className="text-lg text-gray-600 mb-8">
                At BOH Concepts, our values are not just words on a page, they are the principles that guide 
                every decision we make and every interaction we have. From our leadership team to our 
                frontline staff, we are committed to embodying these values in everything we do.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ValuesPage;
