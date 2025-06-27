import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HowToHelp = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const helpOptions = [
    {
      title: "Donate",
      description: "Your financial contribution directly supports our programs and helps us reach more people in need.",
      image: "/images/foundation/donate.jpeg",
      buttonText: "Donate Now",
      buttonLink: "/donate",
      color: "bg-brand-blue"
    },
    {
      title: "Volunteer",
      description: "Share your time and skills to make a difference. We have opportunities both locally and remotely.",
      image: "/images/foundation/volunteer.webp",
      buttonText: "Join Us",
      buttonLink: "/volunteer",
      color: "bg-brand-blue"
    },
    {
      title: "Partner With Us",
      description: "Organizations and businesses can partner with us to create sustainable impact through collaborative initiatives.",
      image: "/images/foundation/partner.avif",
      buttonText: "Learn More",
      buttonLink: "/partnership",
      color: "bg-brand-blue"
    }
  ];

  return (
    <section className="py-12" id="how-to-help">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-sm font-medium tracking-wider text-gray-600 uppercase mb-2">
            HOW TO HELP
          </h2>
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            JOIN OUR MISSION
          </h3>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            There are many ways to support our work and make a meaningful difference in the lives of those we serve.
          </p>
        </div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {helpOptions.map((option, index) => (
            <div 
              key={option.title}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 delay-${index * 100} transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="h-48 overflow-hidden bg-gray-900">
                <img 
                  src={option.image} 
                  alt={`${option.title} - BOH Foundation`}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              
              <div className="p-5 flex flex-col h-48">
                <h3 className="text-xl font-bold mb-2 text-center">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-auto">
                  {option.description}
                </p>
                
                <Button
                  asChild
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
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
