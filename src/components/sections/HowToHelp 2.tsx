import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Handshake, Building } from "lucide-react";

const HowToHelp = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const helpOptions = [
    {
      title: "Donate",
      description: "Your financial contribution directly supports our programs and helps us reach more people in need.",
      icon: <Heart className="h-10 w-10 text-white" />,
      buttonText: "Donate Now",
      buttonLink: "/donate",
      color: "bg-brand-blue"
    },
    {
      title: "Volunteer",
      description: "Share your time and skills to make a difference. We have opportunities both locally and remotely.",
      icon: <Handshake className="h-10 w-10 text-white" />,
      buttonText: "Join Us",
      buttonLink: "/volunteer",
      color: "bg-brand-blue"
    },
    {
      title: "Partner With Us",
      description: "Organizations and businesses can partner with us to create sustainable impact through collaborative initiatives.",
      icon: <Building className="h-10 w-10 text-white" />,
      buttonText: "Learn More",
      buttonLink: "/partnership",
      color: "bg-brand-blue"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50" id="how-to-help">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="bg-brand-earth/10 text-brand-earth px-3 py-1 rounded-md text-sm font-medium">
              HOW TO HELP
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h2>
          
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            There are many ways to support our work and make a meaningful difference in the lives of those we serve.
          </p>
        </div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {helpOptions.map((option, index) => (
            <div 
              key={option.title}
              className={`rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-${index * 150} transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className={`${option.color} p-6 text-center`}>
                <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full mb-4">
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{option.title}</h3>
              </div>
              
              <div className="bg-white p-6 flex flex-col h-64">
                <p className="text-gray-700 mb-8 flex-grow">
                  {option.description}
                </p>
                
                <Button
                  asChild
                  className={`w-full ${
                    option.color === "bg-brand-earth" 
                      ? "bg-brand-earth hover:bg-brand-earth/90" 
                      : option.color === "bg-brand-blue-dark"
                        ? "bg-brand-blue-dark hover:bg-brand-blue-dark/90"
                        : "bg-brand-blue hover:bg-brand-blue/90"
                  } text-white`}
                >
                  <Link to={option.buttonLink}>
                    {option.buttonText}
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
