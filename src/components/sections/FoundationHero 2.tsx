import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Suspense } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";


const FoundationHero = () => {

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-gray-800"></div>}>
          <div className="w-full h-full">
            <OptimizedImage
              src="/images/foundation/education.jpeg"
              alt="BOH Foundation - Empowering Lives"
              className="object-cover w-full h-full"
              loading="eager"
              fetchPriority="high"
              width={1920}
              height={1080}
              decoding="async"
              sizes="100vw"
            />
          </div>
        </Suspense>

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-dark/60 to-brand-blue-dark/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center h-full">
        <div className="max-w-3xl">
          <div className="mb-3 animate-fade-in">
            <span className="bg-brand-earth text-white px-3 py-1 rounded-md text-sm font-medium">
              BOH FOUNDATION
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase text-white mb-4 md:mb-6 leading-tight animate-fade-in hero-title-shadow">
            Empowering Lives, Building Hope
          </h1>

          <p className="text-white text-lg md:text-xl mb-6 md:mb-8 max-w-2xl font-medium animate-fade-in hero-subtitle-shadow">
            Supporting minorities through education, clean water, clothing, and financial assistance programs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button
              asChild
              size="lg"
              className="bg-brand-earth hover:bg-brand-earth/90 text-white"
            >
              <Link to="/donate">Donate Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 bg-transparent"
            >
              <Link to="/foundation/get-involved">
                Get Involved
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundationHero;
