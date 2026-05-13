"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface Card {
  title: string;
  imageSrc: string;
  href?: string;
}

export default function CardsSlider({ cards }: { cards: Card[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setCardsToShow(1);
      } else {
        setCardsToShow(2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, cards.length - cardsToShow);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  }, [maxIndex]);

  // Auto-move functionality
  useEffect(() => {
    if (cards.length <= cardsToShow) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(interval);
  }, [handleNext, cards.length, cardsToShow]);

  return (
    <div className="w-full relative px-6 lg:px-20">
      <div className="flex justify-end gap-4 mb-8">
        <button 
          onClick={handlePrev} 
          className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-[#d71921] hover:border-[#d71921] hover:text-white transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext} 
          className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-[#d71921] hover:border-[#d71921] hover:text-white transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-hidden w-full">
        <motion.div 
          className="flex"
          animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
        >
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="flex-none w-full xl:w-1/2 px-4 lg:px-6"
            >
              <div className="flex flex-col md:flex-row h-auto md:h-[550px] lg:h-[600px] w-full bg-white shadow-sm overflow-hidden">
                {/* Image */}
                <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {/* Text Container */}
                <div className="w-full md:w-1/2 bg-[#fae8e8] p-10 lg:p-14 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-sans font-semibold text-black leading-snug">
                      {card.title}
                    </h3>
                  </div>
                  
                  <Link href={card.href || "#"} className="mt-12 flex items-center gap-4 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-[#d71921] group-hover:border-[#d71921] group-hover:text-white transition-colors shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-black font-semibold text-[13px] uppercase tracking-wider group-hover:text-[#d71921] transition-colors">
                      Read more
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
