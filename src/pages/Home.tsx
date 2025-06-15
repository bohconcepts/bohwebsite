import { Helmet } from 'react-helmet-async';
import { COMPANY_NAME } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Statistics from '@/components/sections/Statistics';
import Testimonials from '@/components/sections/Testimonials';
import ClientsSection from '@/components/sections/ClientsSection';
import CtaSection from '@/components/sections/CtaSection';

const Home = () => {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>{`${COMPANY_NAME} | ${t('Hospitality Staffing Redefined')}`}</title>
        <meta name="description" content={t('Hero Subtitle')} />
      </Helmet>
      
      <Hero />
      <Services />
      <Statistics />
      <Testimonials />
      <ClientsSection />
      <CtaSection />
    </>
  );
};

export default Home;