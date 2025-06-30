import { useInView } from "react-intersection-observer";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Quote } from "lucide-react";

const OurMission = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      {/* CEO Message Section */}
      <section className="py-12 md:py-20 bg-white" id="ceo-message">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div 
              className={`transition-all duration-1000 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="inline-block mb-4">
                <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-md text-sm font-medium">
                  FROM OUR CEO
                </span>
              </div>
              
              <div className="mb-6">
                <Quote className="text-brand-orange h-10 w-10 mb-2 opacity-80" />
                <p className="text-gray-700 text-xl italic mb-6 leading-relaxed">
                  "Our partnership and elevated level of service will allow you and your leaders to focus on what you do best: creating fantastic and memorable experiences for your guests"
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="font-bold text-gray-900">Kelvis Quaynor</p>
                  <p className="text-sm text-gray-600">CEO & Founder</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`transition-all duration-1000 delay-300 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <OptimizedImage
                src="/images/team/kelvis.jpg"
                alt="Kelvis Quaynor - CEO & Founder"
                className="rounded-lg shadow-xl object-cover w-full h-full max-h-[500px]"
                width={600}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
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
    </>
  );
};

export default OurMission;
