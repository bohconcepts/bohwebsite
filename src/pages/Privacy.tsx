import { Helmet } from 'react-helmet-async';
import { COMPANY_NAME } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyInfo } from '@/hooks/useLocalizedConstants';

const Privacy = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>{`${COMPANY_NAME} | ${t('footer_privacy_policy')}`}</title>
        <meta name="description" content={`${COMPANY_NAME} privacy policy and data protection information.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">{t('footer_privacy_policy')}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-sm text-gray-500 mb-6">Last Updated: May 31, {currentYear}</p>
            
            <div className="prose prose-blue max-w-none">
              <h2>1. Introduction</h2>
              <p>
                {companyInfo.name} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by {companyInfo.name}.
              </p>
              <p>
                This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service"). By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
              </p>
              
              <h2>2. Information We Collect</h2>
              <p>
                We collect information from you when you visit our website, register on our site, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or otherwise contact us.
              </p>
              <h3>2.1 Personal Information</h3>
              <p>
                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
              </p>
              <p>
                Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
              </p>
              
              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>
              
              <h2>4. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
              
              <h2>5. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
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

export default Privacy;
