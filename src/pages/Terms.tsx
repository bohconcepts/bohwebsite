import { Helmet } from 'react-helmet-async';
import { COMPANY_NAME } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyInfo } from '@/hooks/useLocalizedConstants';

const Terms = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>{`${COMPANY_NAME} | ${t('footer_terms_of_service')}`}</title>
        <meta name="description" content={`${COMPANY_NAME} terms of service and usage conditions.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">{t('footer_terms_of_service')}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-sm text-gray-500 mb-6">Last Updated: May 31, {currentYear}</p>
            
            <div className="prose prose-blue max-w-none">
              <h2>1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and {companyInfo.name} ("we," "us," or "our"), concerning your access to and use of our website and services.
              </p>
              <p>
                You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
              </p>
              
              <h2>2. Services</h2>
              <p>
                {companyInfo.name} provides hospitality staffing services, connecting qualified professionals with businesses in the hospitality industry. Our services include but are not limited to:
              </p>
              <ul>
                <li>Temporary staffing solutions</li>
                <li>Permanent placement services</li>
                <li>Hospitality consulting</li>
                <li>Training and development programs</li>
              </ul>
              
              <h2>3. User Representations</h2>
              <p>
                By using the Site, you represent and warrant that:
              </p>
              <ol>
                <li>All registration information you submit will be true, accurate, current, and complete</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service</li>
                <li>You are not a minor in the jurisdiction in which you reside</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise</li>
                <li>You will not use the Site for any illegal or unauthorized purpose</li>
              </ol>
              
              <h2>4. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
              </p>
              
              <h2>5. User Data</h2>
              <p>
                We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site.
              </p>
              
              <h2>6. Contact Us</h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
              </p>
              <p>
                {companyInfo.name}<br />
                Phone: {companyInfo.phone}<br />
                Address: {companyInfo.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
