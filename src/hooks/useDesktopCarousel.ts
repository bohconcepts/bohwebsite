import { useState, useEffect } from "react";

export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface UseCarouselReturn {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  slides: CarouselSlide[];
  imageClassName: string;
  videoClassName: string;
}

export const useDesktopCarousel = (
  slides: CarouselSlide[]
): UseCarouselReturn => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel - using requestAnimationFrame for better performance
  useEffect(() => {
    let timeoutId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= 5000) {
        // 5 seconds
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        startTime = timestamp;
      }

      timeoutId = requestAnimationFrame(animate);
    };

    timeoutId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(timeoutId);
  }, [slides.length]);

  return {
    currentSlide,
    setCurrentSlide,
    slides,
    // Desktop: Focus on center with slight upward positioning for better composition
    imageClassName:
      "w-full h-full object-cover object-[center_5%] brightness-110 contrast-110 saturate-110",
    videoClassName:
      "w-full h-full object-cover object-[center_5%] brightness-110 contrast-110 saturate-110",
  };
};
