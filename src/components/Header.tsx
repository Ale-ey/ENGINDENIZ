"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `relative group transition-colors ${isActive ? "text-[#c31524] italic" : "text-black hover:text-[#c31524]"}`;
  };

  const getSpanClasses = (path: string) => {
    const isActive = pathname === path;
    return `absolute -bottom-1 left-0 h-[2px] bg-[#c31524] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm flex h-[110px] md:h-[120px] w-full">
        {/* Left Side (Logo Box) */}
        <Link href="/" className="hidden md:flex w-[260px] lg:w-[320px] bg-white border-r border-gray-100 items-center justify-center shrink-0">
          <Image src="/logo.svg" alt="Engin Deniz Logo" width={180} height={84} priority />
        </Link>

        {/* Right Side */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="hidden md:flex flex-1 items-center justify-between px-8 border-b border-gray-200 text-[13px] text-gray-500">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-black fill-black" />
              <span>Call for free consultation</span>
              <span className="font-semibold text-gray-800 ml-2">+43 1 514 30 9</span>
            </div>
            <div className="hidden xl:flex items-center">
              <span>Working time: Monday to Friday</span>
              <span className="font-semibold text-gray-800 ml-2">9 a.m. - 5 p.m.</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>Follow us on:</span>
              <div className="flex items-center space-x-2">
                <div className="bg-[#d71921] rounded-full p-[5px] cursor-pointer hover:bg-red-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div className="bg-[#d71921] rounded-full p-[5px] cursor-pointer hover:bg-red-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </div>
                <div className="bg-[#d71921] rounded-full p-[5px] cursor-pointer hover:bg-red-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103v3.3h-1.307c-2.314 0-2.86.9-2.86 3.108v1.047h3.71l-.443 3.667h-3.267v7.98h-3.159Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Nav Bar */}
          <div className="flex-[1.2] flex items-center justify-between px-6 md:px-8 h-full pb-2 md:pb-0">
            <Link href="/" className="md:hidden flex items-center">
              <Image src="/logo.svg" alt="Engin Deniz Logo" width={120} height={56} priority />
            </Link>
            <nav className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-black">
              <a href="/" className={getLinkClasses("/")}>
                Law Firm
                <span className={getSpanClasses("/")}></span>
              </a>
              <a href="/team" className={getLinkClasses("/team")}>
                Team
                <span className={getSpanClasses("/team")}></span>
              </a>
              <a href="/real-estate-law" className={getLinkClasses("/real-estate-law")}>
                Real Estate Law
                <span className={getSpanClasses("/real-estate-law")}></span>
              </a>
              <a href="/panorama" className={getLinkClasses("/panorama")}>
                Panorama
                <span className={getSpanClasses("/panorama")}></span>
              </a>
              <a href="/anniversary" className={getLinkClasses("/anniversary")}>
                Anniversary
                <span className={getSpanClasses("/anniversary")}></span>
              </a>
              <a href="/contact" className={getLinkClasses("/contact")}>
                Contact
                <span className={getSpanClasses("/contact")}></span>
              </a>
            </nav>
            <Link href="/contact" className="font-display hidden md:block bg-[#e40037] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-red-800 transition-colors text-[15px]">
              Hire Us
            </Link>

            {/* Mobile Hamburger Icon */}
            <button 
              className="md:hidden text-black hover:text-[#d71921] transition-colors flex items-center justify-center p-2 rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-full"
        }`}
      >
        <button 
          className="absolute top-6 right-6 text-black hover:text-[#d71921] transition-colors p-2 rounded-full border border-gray-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close Mobile Menu"
        >
          <X className="w-8 h-8" />
        </button>

        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
          <Image src="/logo.svg" alt="Engin Deniz Logo" width={160} height={75} priority className="mb-12" />
        </Link>

        <nav className="flex flex-col items-center space-y-6 text-xl font-medium text-black">
          <a href="/" className={pathname === "/" ? "text-[#c31524] italic" : "hover:text-[#c31524] transition-colors"} onClick={() => setIsMobileMenuOpen(false)}>Law Firm</a>
          <a href="/team" className={pathname === "/team" ? "text-[#c31524] italic" : "hover:text-[#c31524] transition-colors"} onClick={() => setIsMobileMenuOpen(false)}>Team</a>
          <a href="/real-estate-law" className={pathname === "/real-estate-law" ? "text-[#c31524] italic" : "hover:text-[#c31524] transition-colors"} onClick={() => setIsMobileMenuOpen(false)}>Real Estate Law</a>
          <a href="/panorama" className={pathname === "/panorama" ? "text-[#c31524] italic" : "hover:text-[#c31524] transition-colors"} onClick={() => setIsMobileMenuOpen(false)}>Panorama</a>
          <a href="/anniversary" className={pathname === "/anniversary" ? "text-[#c31524] italic" : "hover:text-[#c31524] transition-colors"} onClick={() => setIsMobileMenuOpen(false)}>Anniversary</a>
          <a href="/contact" className={pathname === "/contact" ? "text-[#c31524] italic" : "hover:text-[#c31524] transition-colors"} onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        </nav>

        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-display mt-10 bg-[#e40037] text-white px-10 py-3 rounded-full font-semibold hover:bg-red-800 transition-colors text-[16px] text-center">
          Hire Us
        </Link>

        <div className="mt-auto pb-10 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-black fill-black" />
            <span className="font-semibold text-gray-800">+43 1 514 30 9</span>
          </div>
        </div>
      </div>
    </>
  );
}
