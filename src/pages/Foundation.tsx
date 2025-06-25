import { Helmet } from 'react-helmet-async';
// Import components with explicit file extensions
import FoundationHero from '@/components/sections/FoundationHero.tsx';
import OurMission from '@/components/sections/OurMission.tsx';
import WhatWeDo from '@/components/sections/WhatWeDo.tsx';
import SuccessStories from '@/components/sections/SuccessStories.tsx';
import HowToHelp from '@/components/sections/HowToHelp.tsx';
import ContactForm from '@/components/sections/ContactForm.tsx';

const Foundation = () => {
  // We don't need the t function since we're using static text
  // const { t } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>BOH Foundation | Empowering Lives, Building Hope</title>
        <meta 
          name="description" 
          content="BOH Foundation supports minorities through scholarships, clean water initiatives, clothing donations, and financial assistance." 
        />
      </Helmet>
      
      <FoundationHero />
      <OurMission />
      <WhatWeDo />
      <SuccessStories />
      <HowToHelp />
      <ContactForm />
    </>
  );
};

export default Foundation;
