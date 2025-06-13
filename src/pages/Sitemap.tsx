import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServices } from '@/hooks/useLocalizedConstants';
import { ChevronRight } from 'lucide-react';

const Sitemap = () => {
  const { t } = useLanguage();
  const services = useServices();

  // Group site pages by category
  const siteStructure = [
    {
      title: t('sitemap_main_pages'),
      links: [
        { name: t('nav_home'), path: '/' },
        { name: t('nav_about'), path: '/about' },
        { name: t('nav_services'), path: '/services' },
        { name: t('nav_contact'), path: '/contact' }
      ]
    },
    {
      title: t('sitemap_services'),
      links: services.map(service => ({
        name: service.title,
        path: `/services#${service.id}`
      }))
    },
    {
      title: t('sitemap_legal'),
      links: [
        { name: t('footer_privacy_policy'), path: '/privacy' },
        { name: t('footer_terms_of_service'), path: '/terms' }
      ]
    },
    {
      title: t('sitemap_admin'),
      links: [
        { name: t('admin_login'), path: '/admin/login' }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`${COMPANY_NAME} | ${t('footer_sitemap')}`}</title>
        <meta name="description" content={`${COMPANY_NAME} sitemap - find all pages on our website.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">{t('footer_sitemap')}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-gray-600 mb-8">
              {t('sitemap_description')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {siteStructure.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h2 className="text-xl font-semibold text-brand-blue border-b border-gray-200 pb-2">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex} className="transition-colors hover:bg-gray-50 rounded">
                        <Link 
                          to={link.path} 
                          className="flex items-center py-2 px-3 text-gray-700 hover:text-brand-blue"
                        >
                          <ChevronRight className="h-4 w-4 mr-2 text-brand-orange" />
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sitemap;
