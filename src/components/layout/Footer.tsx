import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useCompanyInfo, useContactInfo, useSocialLinks, useSiteNavigation, useServices } from '@/hooks/useLocalizedConstants';
import { useLanguage } from '@/contexts/LanguageContext';
import { NewsletterSubscriptionForm } from '@/components/forms/NewsletterSubscriptionForm';

const Footer = () => {
  const { t } = useLanguage();
  const companyInfo = useCompanyInfo();
  const contactInfo = useContactInfo();
  const socialLinks = useSocialLinks();
  const siteNavigation = useSiteNavigation();
  const services = useServices();

  return (
    <footer className="bg-brand-blue text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-white/5 rounded-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('footer_stay_updated')}</h3>
              <p className="text-white/80">
                {t('footer_subscribe_to_newsletter')}
              </p>
            </div>
            <NewsletterSubscriptionForm className="w-full" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/logo/boh_logo.png"
                alt="BOH Concepts Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-300 mb-2">{companyInfo.tagline}</p>
            <p className="text-white/80 mb-6">
              {t('footer_company_description')}
            </p>
            <div className="flex space-x-4">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
              </a>
              {/* <a href={socialLinks.twitter || '#'} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
              </a> */}
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer_quick_links')}</h4>
            <ul className="space-y-3">
              {siteNavigation.map((item: { title: string; href: string; dropdown?: { title: string; href: string }[] }) => (
                item.title === "About" ? (
                  // For About section, render its dropdown items
                  item.dropdown?.map((dropItem) => (
                    <li key={dropItem.title}>
                      <Link to={dropItem.href} className="text-white/80 hover:text-white transition-colors">
                        {t(dropItem.title)}
                      </Link>
                    </li>
                  ))
                ) : (
                  // For other navigation items, render as normal
                  <li key={item.title}>
                    <Link to={item.href} className="text-white/80 hover:text-white transition-colors">
                      {t(item.title)}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer_our_services')}</h4>
            <ul className="space-y-3">
              {services.slice(0, 4).map((service) => (
                <li key={service.id}>
                  <Link to={`/services#${service.id}`} className="text-white/80 hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer_contact_us')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-brand-orange mt-0.5" />
                <a href={`mailto:${contactInfo.email}`} className="text-white/80 hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-brand-orange mt-0.5" />
                <a href={`tel:${contactInfo.phone}`} className="text-white/80 hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-orange mt-0.5" />
                <span className="text-white/80">{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            &copy; {new Date().getFullYear()} {companyInfo.name}. {t('footer_rights_reserved')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
              {t('footer_privacy_policy')}
            </Link>
            <Link to="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
              {t('footer_terms_of_service')}
            </Link>
            <Link to="/sitemap" className="text-white/70 hover:text-white text-sm transition-colors">
              {t('footer_sitemap')}
            </Link>
            {/* <Link to="/admin/login" className="text-white/70 hover:text-white text-sm transition-colors font-semibold">
              Admin Portal
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;