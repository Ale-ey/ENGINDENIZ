"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Interview {
  videoSrc: string;
  name: string;
}

export default function InterviewsSlider({ interviews }: { interviews: Interview[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [playingCount, setPlayingCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1280) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, interviews.length - cardsToShow);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (interviews.length <= cardsToShow) return;
    if (playingCount > 0) return; // Pause auto-scroll when a video is playing

    const interval = setInterval(() => {
      handleNext();
    }, 6000); 
    return () => clearInterval(interval);
  }, [handleNext, interviews.length, cardsToShow, playingCount]);

  return (
    <div className="w-full relative px-6 lg:px-20 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl lg:text-4xl font-sans font-medium text-black">
          Interviews
        </h2>
        <div className="flex gap-4">
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
      </div>

      <div className="overflow-hidden w-full py-4 -my-4">
        <motion.div 
          className="flex"
          animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
        >
          {interviews.map((interview, idx) => (
            <div 
              key={idx} 
              className="flex-none w-full md:w-1/2 xl:w-1/3 px-4"
            >
              <div className="flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-lg h-full border border-gray-100">
                <video 
                  className="w-full aspect-video object-cover"
                  controls 
                  preload="metadata"
                  src={`${interview.videoSrc}#t=1.0`}
                  onPlay={() => setPlayingCount(prev => prev + 1)}
                  onPause={() => setPlayingCount(prev => Math.max(0, prev - 1))}
                  onEnded={() => setPlayingCount(prev => Math.max(0, prev - 1))}
                />
                <div className="p-6 md:p-8 flex-1 flex items-center justify-center">
                  <p className="text-black font-medium text-center font-sans text-lg">
                    {interview.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
