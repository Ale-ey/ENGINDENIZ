"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GalleryMarquee({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  // Split images into two rows for the marquee effect
  const mid = Math.ceil(images.length / 2);
  const row1 = images.slice(0, mid);
  const row2 = images.slice(mid);

  const MarqueeRow = ({ items, reverse = false, speed = 40 }: { items: string[], reverse?: boolean, speed?: number }) => (
    <div className="flex overflow-hidden relative group h-[200px] md:h-[300px] lg:h-[350px] w-full">
      <motion.div
        className="flex gap-4 md:gap-6 absolute left-0 h-full"
        animate={{ 
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] 
        }}
        transition={{ 
          ease: "linear", 
          duration: speed, 
          repeat: Infinity 
        }}
        style={{ width: 'max-content' }}
      >
        {/* Duplicate the items once to ensure a seamless infinite scroll */}
        {[...items, ...items].map((src, idx) => (
          <div 
            key={idx} 
            className="relative h-full aspect-[4/3] overflow-hidden rounded-md flex-none shadow-sm group-hover:opacity-60 hover:!opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <Image
              src={src}
              alt={`Gallery image ${idx}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 py-10 bg-white">
      <div className="px-6 lg:px-20 mb-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-sans font-medium text-black mb-6">
          Events & Gallery
        </h2>
        <p className="text-[#5a6a7e] font-serif text-lg max-w-3xl mx-auto leading-relaxed">
          On October 3, 2018, we celebrated our 60th company anniversary together with the inauguration of our new, larger law firm at Marc Aurel Straße 6 with over 200 guests.
        </p>
      </div>
      
      {/* Container needs overflow hidden so absolute positioned motion divs don't cause horizontal scrolling issues */}
      <div className="w-full overflow-hidden flex flex-col gap-4 md:gap-6">
        <MarqueeRow items={row1} speed={150} />
        <MarqueeRow items={row2} reverse speed={180} />
      </div>
    </div>
  );
}
