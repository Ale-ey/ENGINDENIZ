"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 bg-black">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Hero Background"
          fill
          sizes="100vw"
          quality={100}
          unoptimized={true}
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      
      {/* Slider Controls */}
      {images.length > 1 && (
        <div className="absolute bottom-12 right-6 lg:right-20 flex space-x-4 z-20">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
