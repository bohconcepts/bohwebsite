// src/hooks/useMobileCarousel.ts
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

export const useMobileCarousel = (
  slides: CarouselSlide[]
): UseCarouselReturn => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    let timeoutId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= 4000) {
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
    // FIX: Use object-contain on mobile, object-cover on desktop
    imageClassName:
      "w-full h-full md:object-cover object-contain object-center brightness-105 contrast-105 saturate-105",
    videoClassName:
      "w-full h-full md:object-cover object-contain object-center brightness-105 contrast-105 saturate-105",
  };
};
