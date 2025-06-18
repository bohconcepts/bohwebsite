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

export const useMobileCarousel = (slides: CarouselSlide[]): UseCarouselReturn => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel - slightly faster on mobile for better engagement
  useEffect(() => {
    let timeoutId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= 4000) {
        // 4 seconds for mobile (slightly faster)
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
    // Mobile: Use object-contain to show full image or object-center for better mobile viewing
    // Removed the upward positioning that was cropping on mobile
    imageClassName: "w-full h-full object-cover object-center brightness-105 contrast-105 saturate-105",
    videoClassName: "w-full h-full object-cover object-center brightness-105 contrast-105 saturate-105",
  };
};