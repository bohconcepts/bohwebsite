import { useInView } from "react-intersection-observer";
import { GraduationCap, Droplet, Shirt, Wallet } from "lucide-react";
import OptimizedImage from "@/components/common/OptimizedImage";

const WhatWeDo = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const programs = [
    {
      title: "College Scholarships",
      description: "Supporting minority students with financial aid to pursue higher education and achieve their academic goals.",
      icon: <GraduationCap className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/scholarship.JPG"
    },
    {
      title: "Borehole Installations",
      description: "Providing clean water access to communities through sustainable borehole installations and maintenance programs.",
      icon: <Droplet className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/borehole.JPG"
    },
    {
      title: "Clothing Donations",
      description: "Distributing quality clothing to those in need while preserving dignity and offering choice in selection.",
      icon: <Shirt className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/clothing.jpeg"
    },
    {
      title: "Financial Assistance",
      description: "Offering emergency financial support and resources to help individuals overcome temporary hardships.",
      icon: <Wallet className="h-8 w-8 text-brand-earth" />,
      image: "/images/foundation/financial.JPG"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="what-we-do">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="bg-brand-earth/10 text-brand-earth px-3 py-1 rounded-md text-sm font-medium">
              WHAT WE DO
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl uppercase text-gray-900 mb-6">
            Our Core Programs
          </h2>
          
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Through our four focus areas, we provide comprehensive support to communities in need,
            addressing both immediate necessities and long-term development goals.
          </p>
        </div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {programs.map((program, index) => (
            <div 
              key={program.title}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-${index * 150} transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="h-48 overflow-hidden">
                <OptimizedImage
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  width={400}
                  height={300}
                />
              </div>
              
              <div className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="bg-brand-blue-dark/5 p-3 rounded-full mr-4">
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                </div>
                
                <p className="text-gray-700">
                  {program.description}
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
