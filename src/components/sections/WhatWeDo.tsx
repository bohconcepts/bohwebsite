import { useInView } from "react-intersection-observer";
import { GraduationCap, Droplet, Shirt, Wallet } from "lucide-react";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatWeDo = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const programs = [
    {
      titleKey: "foundation_program_scholarship_title",
      descriptionKey: "foundation_program_scholarship_description",
      icon: <GraduationCap className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/scholarship.JPG"
    },
    {
      titleKey: "foundation_program_borehole_title",
      descriptionKey: "foundation_program_borehole_description",
      icon: <Droplet className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/borehole.JPG"
    },
    {
      titleKey: "foundation_program_clothing_title",
      descriptionKey: "foundation_program_clothing_description",
      icon: <Shirt className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/clothing.jpeg"
    },
    {
      titleKey: "foundation_program_financial_title",
      descriptionKey: "foundation_program_financial_description",
      icon: <Wallet className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/financial.JPG"
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-white" id="what-we-do">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="bg-brand-earth/10 text-brand-earth px-3 py-1 rounded-md text-sm font-medium">
              {t('foundation_what_we_do_tag')}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl uppercase text-gray-900 mb-6">
            {t('foundation_what_we_do_title')}
          </h2>
          
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            {t('foundation_what_we_do_description')}
          </p>
        </div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {programs.map((program, index) => (
            <div 
              key={program.titleKey}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-${index * 150} transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="h-56 sm:h-64 md:h-48 overflow-hidden">
                <OptimizedImage
                  src={program.image}
                  alt={t(program.titleKey)}
                  className="w-full h-full object-contain md:object-cover transition-transform duration-500 hover:scale-105"
                  width={400}
                  height={300}
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="bg-brand-blue-dark/5 p-3 rounded-full mr-4">
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t(program.titleKey)}</h3>
                </div>
                
                <p className="text-gray-700">
                  {t(program.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
