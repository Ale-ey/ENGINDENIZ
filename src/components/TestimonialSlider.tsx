"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  text: string;
  name: string;
  subtitle: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // reduced to 4 seconds for more obvious automatic change
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="w-full relative flex items-center justify-between gap-4 md:gap-12 py-12">
      {/* Left Arrow */}
      {testimonials.length > 1 && (
        <button 
          onClick={handlePrev}
          className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-black flex items-center justify-center hover:bg-[#d71921] hover:border-[#d71921] hover:text-white transition-all duration-300 group z-10"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Slider Content */}
      <div className="flex-1 overflow-hidden relative">
        {testimonials.map((testimonial, index) => {
          const isActive = index === currentIndex;
          return (
            <div 
              key={index}
              className={`w-full flex flex-col md:flex-row items-start gap-6 md:gap-12 transition-all duration-700 ease-in-out ${
                isActive 
                  ? "relative opacity-100 pointer-events-auto z-10" 
                  : "absolute top-0 left-0 opacity-0 pointer-events-none z-0"
              }`}
              style={{
                transform: isActive 
                  ? 'translateX(0)' 
                  : 'translateX(-50px)' // Inactive slides wait on the left, so they animate from left to right when becoming active
              }}
            >
              {/* Giant Quote Icon */}
              <div className="shrink-0 text-[#e6f0fa]">
                <svg width="80" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                  <path d="M14.017 21L16.417 14.594C16.594 14.075 16.711 13.568 16.769 13.072C16.828 12.576 16.857 12.138 16.857 11.758C16.857 10.638 16.52 9.771 15.845 9.157C15.17 8.543 14.28 8.236 13.174 8.236C12.525 8.236 11.954 8.358 11.462 8.602C10.97 8.846 10.59 9.176 10.322 9.593L11.597 10.742C11.774 10.459 12.01 10.247 12.305 10.105C12.601 9.963 12.915 9.892 13.249 9.892C13.801 9.892 14.225 10.05 14.519 10.366C14.813 10.682 14.961 11.14 14.961 11.74C14.961 12.071 14.902 12.441 14.784 12.851C14.666 13.261 14.499 13.676 14.282 14.097L12.017 19.349H14.017ZM5.017 21L7.417 14.594C7.594 14.075 7.711 13.568 7.769 13.072C7.828 12.576 7.857 12.138 7.857 11.758C7.857 10.638 7.52 9.771 6.845 9.157C6.17 8.543 5.28 8.236 4.174 8.236C3.525 8.236 2.954 8.358 2.462 8.602C1.97 8.846 1.59 9.176 1.322 9.593L2.597 10.742C2.774 10.459 3.01 10.247 3.305 10.105C3.601 9.963 3.915 9.892 4.249 9.892C4.801 9.892 5.225 10.05 5.519 10.366C5.813 10.682 5.961 11.14 5.961 11.74C5.961 12.071 5.902 12.441 5.784 12.851C5.666 13.261 5.499 13.676 5.282 14.097L3.017 19.349H5.017Z" />
                </svg>
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col flex-1 pt-2">
                <p className="text-[#5a6a7e] text-[15px] md:text-[16px] leading-loose font-serif mb-8 md:mb-10">
                  {testimonial.text}
                </p>
                <h4 className="text-xl md:text-2xl font-sans font-medium text-black mb-1">
                  {testimonial.name}
                </h4>
                <h6 className="text-[#a0b0c0] font-sans text-xs uppercase tracking-wider font-semibold">
                  {testimonial.subtitle}
                </h6>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {testimonials.length > 1 && (
        <button 
          onClick={handleNext}
          className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-black flex items-center justify-center hover:bg-[#d71921] hover:border-[#d71921] hover:text-white transition-all duration-300 group z-10"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
