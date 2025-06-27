import { Helmet } from 'react-helmet-async';
// Import foundation section components
import FoundationHero from '@/components/sections/FoundationHero';
import OurMission from '@/components/sections/OurMission';
import WhatWeDo from '@/components/sections/WhatWeDo';
//import SuccessStories from '@/components/sections/SuccessStories';
import HowToHelp from '@/components/sections/HowToHelp';
//import ContactForm from '@/components/sections/ContactForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Foundation = () => {
  // Use the t function for localization
  const { t } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>{t('foundation_page_title')}</title>
        <meta 
          name="description" 
          content={t('foundation_meta_description')} 
        />
      </Helmet>
      
      <FoundationHero />
      <OurMission />
      <WhatWeDo />
      {/*<SuccessStories />*/}
      <HowToHelp />
      {/*<ContactForm />*/}
    </>
  );
};

export default Foundation;
