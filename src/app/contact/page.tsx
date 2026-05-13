import React from "react";
import { Metadata } from "next";
import { getContactPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import Image from "next/image";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";
import parse from "html-react-parser";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getContactPage();
  if (!pageData || !pageData.seo) return {};

  const { seo } = pageData;
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function ContactPage() {
  const pageData = await getContactPage();

  if (!pageData) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="p-20 text-center text-red-500">Error: Contact Page not found in WordPress.</div>
      </main>
    );
  }

  const $ = cheerio.load(pageData.content);

  // Extract Hero Title
  let heroTitle = $("h1").first().text().trim() || pageData.title || "Contact Us";

  // Extract Sections (e.g. Enquiry, Newsletter)
  const sections: { title: string, paras: string[] }[] = [];
  $("h2").each((i, el) => {
    const title = $(el).text().trim();
    const paras: string[] = [];
    let current = $(el).next();
    while (current.length && !current.is("h2") && !current.is("figure") && !current.is("img")) {
      if (current.is("p")) {
        const html = current.html()?.trim();
        if (html) paras.push(html);
      }
      current = current.next();
    }
    sections.push({ title, paras });
  });

  const enquirySection = sections[0] || { title: "Make an enquiry?", paras: [] };
  const newsletterSection = sections[1] || null;

  // Extract Image
  let imageSrc = pageData.featuredImage?.node?.sourceUrl || $("img").first().attr("src") || "";
  if (imageSrc) imageSrc = imageSrc.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#fae8e8] py-16 md:py-24 px-6 lg:px-20 w-full flex items-center justify-start relative">
        <div className="max-w-7xl mx-auto w-full">
          <FadeIn delay={0.1} direction="up" className="z-10">
            <h1 className="text-3xl md:text-5xl font-sans font-medium text-black ml-0 lg:ml-20">
              {heroTitle}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="w-full flex flex-col lg:flex-row bg-white min-h-[700px]">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-10 lg:p-20 xl:p-24 flex flex-col relative z-10 bg-[#f5f5f5]">
          <FadeIn direction="right" delay={0.2} className="w-full max-w-md mx-auto lg:ml-auto lg:mr-10 xl:mr-20">
            <h2 className="text-3xl lg:text-4xl font-sans font-medium text-black mb-6">
              {enquirySection.title}
            </h2>
            
            {enquirySection.paras.map((para, i) => (
              <div key={i} className="text-[#5a6a7e] font-serif text-[15px] leading-loose mb-10 wp-parsed-content">
                {parse(para)}
              </div>
            ))}

            <form className="flex flex-col space-y-4 font-sans w-full mb-16">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full px-5 py-4 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[15px]"
                required
              />
              <input 
                type="text" 
                placeholder="Adresse" 
                className="w-full px-5 py-4 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[15px]"
                required
              />
              <input 
                type="text" 
                placeholder="PLZ / Ort" 
                className="w-full px-5 py-4 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[15px]"
                required
              />
              <input 
                type="email" 
                placeholder="E-Mail" 
                className="w-full px-5 py-4 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[15px]"
                required
              />
              
              <div className="pt-8">
                <button 
                  type="submit" 
                  className="bg-black text-white px-10 py-3.5 rounded-full font-sans font-medium hover:bg-[#d71921] transition-colors text-[15px] inline-flex items-center justify-center"
                >
                  Register
                </button>
              </div>
            </form>

            {newsletterSection && (
              <div className="w-full mt-12 pt-12 border-t border-gray-200">
                <h2 className="text-3xl lg:text-4xl font-sans font-medium text-black mb-6">
                  {newsletterSection.title}
                </h2>
                {newsletterSection.paras.map((para, i) => (
                  <div key={i} className="text-[#5a6a7e] font-serif text-[15px] leading-loose mb-6 wp-parsed-content">
                    {parse(para)}
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-auto bg-white flex items-center justify-center p-10 lg:p-20 xl:p-24">
          <FadeIn direction="left" delay={0.3} className="w-full aspect-square relative">
            {imageSrc ? (
              <Image 
                src={imageSrc} 
                alt="Contact"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-sans bg-[#111]">
                No Image Found
              </div>
            )}
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
