import { useInView } from "react-intersection-observer";
import { useState } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessStories = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stories = [
    {
      name: "Sarah Johnson",
      location: "Ghana",
      quote: "The BOH Foundation scholarship changed my life. I'm the first in my family to attend college, and now I'm studying to become a doctor so I can give back to my community.",
      image: "/images/foundation/clothing.jpeg",
      program: "Scholarship Program"
    },
    {
      name: "Emmanuel Osei",
      location: "Rural Ghana",
      quote: "Before the borehole was installed, our village women walked 3 miles each way for water. Now we have clean water right here, and our children are healthier and can attend school regularly.",
      image: "/images/foundation/clothing.jpeg",
      program: "Clean Water Initiative"
    },
    {
      name: "Amara Diallo",
      location: "Senegal",
      quote: "The clothing donation program provided me with professional attire for job interviews. I now have steady employment and can support my family with dignity.",
      image: "/images/foundation/bohfoundation.jpeg",
      program: "Clothing Donations"
    },
    {
      name: "Kwame Mensah",
      location: "Nigeria",
      quote: "When my small business was struggling during the pandemic, BOH Foundation's financial assistance helped me stay afloat. Now my business is thriving again and I've hired two employees.",
      image: "/images/foundation/clothing.jpeg",
      program: "Financial Assistance"
    }
  ];

  const [currentStory, setCurrentStory] = useState(0);

  const nextStory = () => {
    setCurrentStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  return (
    <section className="py-16 md:py-24 bg-brand-blue-dark" id="success-stories">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-white/10 text-white px-3 py-1 rounded-md text-sm font-medium">
              SUCCESS STORIES
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl uppercase text-white mb-6">
            Lives We've Transformed
          </h2>
          
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Real stories from real people whose lives have been changed through our programs.
          </p>
        </div>
        
        <div 
          ref={ref} 
          className={`relative max-w-5xl mx-auto transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-full">
                <OptimizedImage
                  src={stories[currentStory].image}
                  alt={stories[currentStory].name}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                />
              </div>
              
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-brand-earth opacity-20" />
                </div>
                
                <p className="text-gray-700 text-lg md:text-xl italic mb-8">
                  "{stories[currentStory].quote}"
                </p>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {stories[currentStory].name}
                  </h4>
                  <p className="text-gray-600 mb-2">{stories[currentStory].location}</p>
                  <span className="inline-block bg-brand-earth/10 text-brand-earth px-3 py-1 rounded-md text-sm">
                    {stories[currentStory].program}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-white text-brand-blue-dark hover:bg-brand-earth hover:text-white"
              onClick={prevStory}
              aria-label="Previous story"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2 items-center">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentStory === index ? "bg-white w-6" : "bg-white/50"
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="bg-white text-brand-blue-dark hover:bg-brand-earth hover:text-white"
              onClick={nextStory}
              aria-label="Next story"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
