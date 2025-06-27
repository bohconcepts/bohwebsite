import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import VolunteerForm from "@/components/forms/VolunteerForm";

const VolunteerPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants are now defined inline

  return (
    <>
      <Helmet>
        <title>{t("volunteer.page.title", "Volunteer With Us | BOH Foundation")}</title>
        <meta
          name="description"
          content={t(
            "volunteer.page.description",
            "Make a difference by volunteering with BOH Foundation. Support our mission to improve hospitality education and opportunities in Africa."
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
              MAKE A DIFFERENCE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase mb-4 text-white">
              {t("volunteer.hero.title", "Be the Change - Volunteer Today")}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {t(
                "volunteer.hero.subtitle",
                "Join our community of passionate volunteers dedicated to making a difference through education and opportunity."
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
              {t("volunteer.impact.title", "The Impact of Your Time")}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.167 48.167 0 0 1 12 20.904a48.167 48.167 0 0 1 8.23-4.41 60.199 60.199 0 0 0-.491-6.347m-15.482 0a50.125 50.125 0 0 0-2.36 4.763M6.677 16.753c.11.308.24.613.395.913m.306.912a60.13 60.13 0 0 0 2.736-2.718 60.043 60.043 0 0 0-1.91-2.882m-6.99 4.688A49.386 49.386 0 0 0 14.935 16.9c.238-.036.476-.074.714-.113A52.403 52.403 0 0 1 8.761 4.977a51.266 51.266 0 0 0-3.658 5.452m10.987 11.264A48.77 48.77 0 0 1 8.761 4.977m0 0A55.61 55.61 0 0 1 12 3.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("volunteer.impact.education.title", "Empower Through Education")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "volunteer.impact.education.description",
                    "Help provide quality hospitality education to those who otherwise wouldn't have access."
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("volunteer.impact.community.title", "Build Community")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "volunteer.impact.community.description",
                    "Connect with like-minded individuals and strengthen communities through meaningful contributions."
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("volunteer.impact.skills.title", "Share Your Skills")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "volunteer.impact.skills.description",
                    "Utilize your unique talents and expertise to create lasting positive change in the hospitality industry."
                  )}
                </p>
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
              {t("volunteer.form.sectionTitle", "Join Our Volunteer Team")}
            </h2>
            <p className="text-lg text-gray-600">
              {t(
                "volunteer.form.sectionDescription",
                "Fill out the form below to express your interest in volunteering. We'll match your skills and interests with our current needs."
              )}
            </p>
          </div>
          
          <VolunteerForm />
        </div>
      </section>
    </>
  );
};

export default VolunteerPage;
