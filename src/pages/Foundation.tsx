import { Helmet } from 'react-helmet-async';
// Import foundation section components
import FoundationHero from '@/components/sections/FoundationHero';
import OurMission from '@/components/sections/OurMission';
import WhatWeDo from '@/components/sections/WhatWeDo';
//import SuccessStories from '@/components/sections/SuccessStories';
import HowToHelp from '@/components/sections/HowToHelp';
//import ContactForm from '@/components/sections/ContactForm';

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
      {/*<SuccessStories />*/}
      <HowToHelp />
      {/*<ContactForm />*/}
    </>
  );
};

export default Foundation;
