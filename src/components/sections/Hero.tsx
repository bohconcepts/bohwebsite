import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, Suspense } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useDesktopCarousel } from "@/hooks/useDesktopCarousel";
import { useMobileCarousel } from "@/hooks/useMobileCarousel";

const Hero = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Carousel slides configuration
  const slides = [
    {
      image: "/images/hero/services.png",
      title: t("Professional Hospitality Services"),
      subtitle: t(
        "Elevating guest experiences with our premium staffing solutions"
      ),
    },
    {
      image: "/images/hero/clients.jpg",
      title: t("Trusted by Industry Leaders"),
      subtitle: t("Partnering with top hotels and resorts across the nation"),
    },
    // {
    //   image: "/images/hero/pricing.png",
    //   title: t("Transparent & Competitive Pricing"),
    //   subtitle: t("Cost-effective staffing solutions tailored to your needs"),
    // },
    {
      image: "/images/hero/process.png",
      title: t("Streamlined Recruitment Process"),
      subtitle: t(
        "From selection to onboarding, we handle every step with care"
      ),
    },
    {
      image: "/images/hero/main_new.mp4",
      title: t("Elevating Guest Experiences"),
      subtitle: t("Professional hospitality staff that exceed expectations"),
    },
    {
      image: "/images/hero/bedlay.png",
      title: t("Premium Hospitality Staffing"),
      subtitle: t("Exceptional talent for luxury hotels and resorts"),
    },
    {
      image: "/images/hero/kate-townsend-hEC6zxdFF0M-unsplash.jpg",
      title: t("Exceptional Hospitality Service"),
      subtitle: t(
        "Professional staff delivering impeccable table service and guest attention"
      ),
    },
  ];

  // Use appropriate hook based on screen size
  const desktopCarousel = useDesktopCarousel(slides);
  const mobileCarousel = useMobileCarousel(slides);

  const carousel = isMobile ? mobileCarousel : desktopCarousel;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {/* Carousel Images */}
        {carousel.slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === carousel.currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Suspense
              fallback={<div className="w-full h-full bg-gray-800"></div>}
            >
              <div className="w-full h-full">
                {slide.image.endsWith(".mp4") ? (
                  <video

                    className="w-full h-full object-cover object-center md:object-[center_5%] brightness-110 contrast-110 saturate-110"

                    className={carousel.videoClassName}

                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? "auto" : "metadata"}
                  >
                    <source src={slide.image} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <OptimizedImage
                    src={slide.image}
                    alt={`BOH Concepts - ${index + 1}`}

                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    width={1920}
                    height={1080}
                    decoding="async"
                    sizes="100vw"
                  />
                )}
              </div>
            </Suspense>
          </div>
        ))}

        {/* Ultra-light overlay just for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/30 via-brand-blue/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center h-full">
        <div className="max-w-3xl">
          {/* Removed motion effects for better performance */}
          <div className="mb-3">
            <span className="bg-brand-orange text-white px-3 py-1 rounded-md text-sm font-medium">
              {t("A TRUSTED PARTNER")}
            </span>
          </div>

          <h1

          >
            {carousel.slides[carousel.currentSlide].title}
          </h1>

          <p

            key={`subtitle-${currentSlide}`}
            className="text-white text-base md:text-lg mb-6 md:mb-8 max-w-2xl font-medium animate-fade-in drop-shadow"

            key={`subtitle-${carousel.currentSlide}`}
            className="text-white text-base md:text-lg mb-6 md:mb-8 max-w-2xl font-medium animate-fade-in"
            style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.6)" }}

          >
            {carousel.slides[carousel.currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 bg-transparent"
            >
              <a
                href="https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=8d9ee166-cbd6-4856-812a-036cba2c60b6&ccId=19000101_000001&lang=en_US"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Join Our Team")}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              <Link to="/our-approach">{t("Our Approach")}</Link>
            </Button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 md:mt-8 gap-2 animate-fade-in">
            {carousel.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => carousel.setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  carousel.currentSlide === index
                    ? "bg-brand-orange w-6"
                    : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
