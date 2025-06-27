import { useInView } from "react-intersection-observer";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useLanguage } from "@/contexts/LanguageContext";

const OurMission = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-12 md:py-24 bg-brand-blue-dark/5" id="our-mission">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div 
            ref={ref} 
            className={`transition-all duration-1000 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <OptimizedImage
              src="/images/foundation/hero.png"
              alt="BOH Foundation Mission"
              className="rounded-lg shadow-xl object-cover w-full h-full max-h-[500px]"
              width={600}
              height={500}
            />
          </div>
          
          <div 
            className={`transition-all duration-1000 delay-300 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block mb-4">
              <span className="bg-brand-earth/10 text-brand-earth px-3 py-1 rounded-md text-sm font-medium">
                {t('foundation_mission_tag')}
              </span>
            </div>
            
            <h3 className="text-1xl md:text-2xl uppercase text-gray-900 mb-6 leading-tight">
              {t('foundation_mission_title')}
            </h3>
            
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {t('foundation_mission_paragraph_1')}
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              {t('foundation_mission_paragraph_2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
