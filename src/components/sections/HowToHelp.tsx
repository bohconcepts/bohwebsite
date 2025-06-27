import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const HowToHelp = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const helpOptions = [
    {
      titleKey: "foundation_help_donate_title",
      descriptionKey: "foundation_help_donate_description",
      image: "/images/foundation/donate.jpeg",
      buttonTextKey: "foundation_help_donate_button",
      buttonLink: "/donate",
      color: "bg-brand-blue"
    },
    {
      titleKey: "foundation_help_volunteer_title",
      descriptionKey: "foundation_help_volunteer_description",
      image: "/images/foundation/volunteer.webp",
      buttonTextKey: "foundation_help_volunteer_button",
      buttonLink: "/volunteer",
      color: "bg-brand-blue"
    },
    {
      titleKey: "foundation_help_partner_title",
      descriptionKey: "foundation_help_partner_description",
      image: "/images/foundation/partner.avif",
      buttonTextKey: "foundation_help_partner_button",
      buttonLink: "/partnership",
      color: "bg-brand-blue"
    }
  ];

  return (
    <section className="py-12" id="how-to-help">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-sm font-medium tracking-wider text-gray-600 uppercase mb-2">
            {t('foundation_how_to_help_tag')}
          </h2>
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            {t('foundation_how_to_help_title')}
          </h3>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            {t('foundation_how_to_help_description')}
          </p>
        </div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {helpOptions.map((option, index) => (
            <div 
              key={option.titleKey}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 delay-${index * 100} transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="h-48 overflow-hidden bg-gray-900">
                <img 
                  src={option.image} 
                  alt={`${t(option.titleKey)} - BOH Foundation`}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              
              <div className="p-5 flex flex-col h-48">
                <h3 className="text-xl font-bold mb-2 text-center">{t(option.titleKey)}</h3>
                <p className="text-gray-600 text-sm mb-auto">
                  {t(option.descriptionKey)}
                </p>
                
                <Button
                  asChild
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
                >
                  <Link to={option.buttonLink}>
                    {t(option.buttonTextKey)}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToHelp;
