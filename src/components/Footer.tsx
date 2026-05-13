import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-[#e5e7eb] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="mb-6 block">
              <Image 
                src="/logo.svg" 
                alt="Engin Deniz Logo" 
                width={200} 
                height={80} 
                className="w-48 h-auto"
              />
            </Link>
            <p className="text-[#5a6a7e] font-serif text-[15px] leading-relaxed">
              Leading specialist law firm for real estate. We guarantee direct support from a single lawyer with precise legal analyses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-black font-sans font-semibold text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="flex flex-col space-y-3">
              <li><Link href="/" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Law Firm</Link></li>
              <li><Link href="/team" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Team</Link></li>
              <li><Link href="/real-estate-law" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Real Estate Law</Link></li>
              <li><Link href="/anniversary" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Anniversary</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-black font-sans font-semibold text-lg mb-6 tracking-wide">Legal</h4>
            <ul className="flex flex-col space-y-3">
              <li><Link href="/imprint" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Imprint</Link></li>
              <li><Link href="/privacy-policy" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-[#5a6a7e] hover:text-[#e40037] transition-colors font-serif">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-black font-sans font-semibold text-lg mb-6 tracking-wide">Contact</h4>
            <ul className="flex flex-col space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[#e40037] mr-3 mt-0.5 shrink-0" />
                <span className="text-[#5a6a7e] font-serif leading-relaxed">
                  Schottenring 16<br />
                  1010 Vienna, Austria
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-[#e40037] mr-3 shrink-0" />
                <span className="text-[#5a6a7e] font-serif">+43 1 514 30 9</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-[#e40037] mr-3 shrink-0" />
                <span className="text-[#5a6a7e] font-serif">office@engin-deniz.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e5e7eb] flex flex-col md:flex-row items-center justify-between">
          <p className="text-[#a0b0c0] font-serif text-sm">
            &copy; {new Date().getFullYear()} Engin-Deniz Rechtsanwälte. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Icons Placeholders */}
            <a href="#" className="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center text-[#5a6a7e] hover:bg-[#e40037] hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center text-[#5a6a7e] hover:bg-[#e40037] hover:text-white transition-colors">
              <span className="sr-only">X (Twitter)</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
