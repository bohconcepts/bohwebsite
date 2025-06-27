import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import DonationForm from "@/components/forms/DonationForm";

const DonatePage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants are now defined inline

  return (
    <>
      <Helmet>
        <title>{t("donate.page.title", "Support Our Mission | BOH Foundation")}</title>
        <meta
          name="description"
          content={t(
            "donate.page.description",
            "Your donation helps the BOH Foundation provide education and opportunities in hospitality across Africa. Make a difference today."
          )}
        />
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
              SUPPORT OUR MISSION
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase mb-4 text-white">
              {t("donate.hero.title", "Your Support Makes a Difference")}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {t(
                "donate.hero.subtitle",
                "Every donation helps us provide education and create opportunities in the hospitality industry across Africa."
              )}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              {t("donate.impact.title", "The Impact of Your Donation")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center bg-brand-orange/10 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("donate.impact.education.title", "Fund Education")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "donate.impact.education.description",
                    "$50 can provide essential educational materials and resources for one student for a month."
                  )}
                </p>
              </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm text-center"
                >
                  <div className="inline-flex items-center justify-center bg-brand-blue/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("donate.impact.training.title", "Support Training")}
                  </h3>
                  <p className="text-gray-600">
                    {t(
                      "donate.impact.training.description",
                      "$250 can fund a full professional training program, including certification for one student."
                    )}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm text-center"
                >
                  <div className="inline-flex items-center justify-center bg-brand-earth/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-earth">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("donate.impact.scholarship.title", "Create Scholarships")}
                  </h3>
                  <p className="text-gray-600">
                    {t(
                      "donate.impact.scholarship.description",
                      "$500 can fund a scholarship that covers tuition, resources, and internship placement support."
                    )}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-brand-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <p className="text-4xl font-bold mb-2">250+</p>
                  <p className="text-lg opacity-90">{t("donate.stats.students", "Students Supported")}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <p className="text-4xl font-bold mb-2">15</p>
                  <p className="text-lg opacity-90">{t("donate.stats.countries", "Countries Reached")}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <p className="text-4xl font-bold mb-2">85%</p>
                  <p className="text-lg opacity-90">{t("donate.stats.employment", "Employment Rate After Training")}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                {t("donate.form.sectionTitle", "Make Your Donation Today")}
              </h2>
              <p className="text-lg text-gray-600">
                {t(
                  "donate.form.sectionDescription",
                  "Your contribution will help provide education, training, and opportunities for talented individuals across Africa."
                )}
              </p>
            </div>
            
            <DonationForm />
          </div>
        </section>

        {/* Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <blockquote className="mt-4 text-xl font-medium text-gray-900 mb-6">
              {t(
                "donate.testimonial.quote",
                "The scholarship I received from the BOH Foundation changed my life. I now have my dream job at a luxury hotel in Accra, and I'm able to support my family. I can't express how grateful I am for the donors who made this possible."
              )}
            </blockquote>
            <div className="mt-6">
              <div className="font-medium text-gray-900">{t("donate.testimonial.name", "Emmanuel Osei")}</div>
              <div className="mt-1 text-gray-500">{t("donate.testimonial.role", "Scholarship Recipient, 2022")}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonatePage;
