// import { useLanguage } from "@/contexts/LanguageContext"; // Removed unused import
import { useInView } from "react-intersection-observer";
import OptimizedImage from "@/components/common/OptimizedImage";

const OurMission = () => {
  // const { t } = useLanguage(); // Removed unused variable
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
                OUR MISSION
              </span>
            </div>
            
            <h3 className="text-1xl md:text-2xl uppercase text-gray-900 mb-6 leading-tight">
              Uplifting Communities Through Compassion and Action
            </h3>
            
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              At BOH Foundation, our mission is to create lasting positive change in underserved communities 
              by providing essential resources, educational opportunities, and financial support. We believe 
              in empowering individuals to overcome systemic barriers and achieve their full potential.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Through our four core programs—scholarships, clean water initiatives, clothing donations, and 
              financial assistance—we address fundamental needs while preserving the dignity and agency of 
              those we serve. Our approach is built on respect, sustainability, and community partnership.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
