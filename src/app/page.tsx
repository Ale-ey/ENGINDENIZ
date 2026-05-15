import React from "react";
import { Metadata } from "next";
import { getLawFirmPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import { Gavel, Globe, Building2, Handshake, ChevronRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import { FadeIn } from "@/components/FadeIn";
import TestimonialSlider from "@/components/TestimonialSlider";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getLawFirmPage();
  if (!pageData || !pageData.seo) return {};

  const { seo } = pageData;
  const ogImage = seo.openGraph?.image?.secureUrl;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.focusKeywords ? [seo.focusKeywords] : undefined,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    robots: {
      index: seo.robots?.includes("index"),
      follow: seo.robots?.includes("follow"),
    },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function Home() {
  const pageData = await getLawFirmPage();

  if (!pageData) {
    return <div className="p-20 text-center text-red-500">Error: Page not found in WordPress</div>;
  }

  // Parse the raw HTML from WordPress Gutenberg editor
  const $ = cheerio.load(pageData.content);

  // Extract Hero
  const heroTitle = $("h1").first().text();

  // Dynamic H2 Sections
  // Extract Featured Image from WordPress
  const featuredImage = pageData.featuredImage?.node?.sourceUrl || null;

  // Extract Gallery Images
  const galleryImages: string[] = [];
  $(".wp-block-gallery img").each((i, el) => {
    let src = $(el).attr("src");
    if (src) {
      // Strip WordPress downscale suffixes to force original full-resolution image
      src = src.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
      galleryImages.push(src);
    }
  });

  const h2s = $("h2");
  
  // Robust Section Finding
  const introHeading = h2s.filter((i, el) => $(el).text().toLowerCase().includes("experts")).first();
  const introTitle = introHeading.text() || "We are legal experts.";
  const introDesc = introHeading.nextUntil("h2", "p").first().text() || $("p").first().text();

  // Extract Advisory Areas
  // Robust matching: find the heading by structure (followed by numbered list items) or fallback to text includes "advisory"
  const advisoryHeading = h2s.filter((i, el) => {
    const nextParas = $(el).nextUntil("h2", "p").map((_, child) => $(child).text()).get();
    let matchCount = 0;
    nextParas.forEach(p => {
      if (p.trim().match(/^(\d{1,2})[\.\-\s]+(.+)$/)) matchCount++;
    });
    return matchCount >= 2 || $(el).text().toLowerCase().includes("advisory");
  }).first();

  const advisoryTitle = advisoryHeading.length > 0 ? advisoryHeading.text() : "Advisory areas";
  const advisoryItems: { num: string; title: string; }[] = [];
  const leftoverParas: string[] = []; // Paragraphs that belong to Quality if Quality H2 is missing

  if (advisoryHeading.length) {
    const allParas = advisoryHeading.nextUntil("h2", "p").map((_, el) => $(el).text()).get();
    allParas.forEach(p => {
      const match = p.trim().match(/^(\d{1,2})[\.\-\s]+(.+)$/);
      if (match) {
        let numStr = match[1];
        if (numStr.length === 1) numStr = "0" + numStr; // Normalize to 01, 02
        advisoryItems.push({
          num: numStr,
          title: match[2].trim()
        });
      } else {
        // Not an advisory area, so it's a regular paragraph (likely the Quality text)
        if (p.trim()) {
          leftoverParas.push(p);
        }
      }
    });
  }

  // Find the Quality section (Pink)
  console.log('ADVISORY ITEMS:', advisoryItems); const qualityHeading = h2s.filter((i, el) => $(el).text().trim().toLowerCase() === "quality").first();
  const qualityTitle = qualityHeading.text() || "Quality";
  let qualityParas = qualityHeading.length > 0 
    ? qualityHeading.nextUntil("h2", "p").map((_, el) => $(el).text()).get() 
    : leftoverParas;
  
  const qualityDesc = qualityParas[0] || "";
  const qualityQuote = qualityParas[1] || "";
  let qualityImageSrc = qualityHeading.length > 0
    ? qualityHeading.nextUntil("h2", "figure").find("img").attr("src") || galleryImages[0] || ""
    : advisoryHeading.nextUntil("h2", "figure").find("img").attr("src") || galleryImages[0] || "";
  
  if (qualityImageSrc) qualityImageSrc = qualityImageSrc.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');

  // Find the Real Estate Quality section (Blue)
  const realEstateHeading = h2s.filter((i, el) => $(el).text().trim().toLowerCase() === "real estate quality" && $(el).next("p").length > 0).first();
  const realEstateTitle = realEstateHeading.text() || "Real Estate Quality";
  const realEstateParas = realEstateHeading.nextUntil("h2", "p").map((_, el) => $(el).text()).get();
  const realEstateDesc = realEstateParas[0] || "";
  const realEstateQuote = realEstateParas[1] || "";
  let realEstateImageSrc = realEstateHeading.nextUntil("h2", "figure").find("img").attr("src") || galleryImages[1] || "";
  if (realEstateImageSrc) realEstateImageSrc = realEstateImageSrc.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');

  const expertiseHeading = h2s.filter((i, el) => $(el).text().toLowerCase().includes("expertise")).first();
  const expertiseSectionTitle = expertiseHeading.length > 0 ? expertiseHeading.text() : "Expertise";

  const clientsSayHeading = h2s.filter((i, el) => $(el).text().toLowerCase().includes("client")).first();
  const clientsSayTitle = clientsSayHeading.length > 0 ? clientsSayHeading.text() : "Our clients say";

  // Expertise List Sections
  const expertiseItems: { title: string; desc: string; }[] = [];
  let isExpertiseSection = false;
  
  h2s.each((i, el) => {
    const text = $(el).text().trim();
    const pText = $(el).next("p").text().toLowerCase();
    
    if (text === expertiseSectionTitle) {
      isExpertiseSection = true;
      return; // Skip adding the title itself
    }
    
    // Stop if we hit history, contact, or a team member (identified by lawyer/partner subtitle)
    if (
      text === clientsSayTitle ||
      text.toLowerCase().includes("history") || 
      text.toLowerCase().includes("contact") || 
      text.toLowerCase().includes("footer") ||
      pText.includes("lawyer") || 
      pText.includes("partner")
    ) {
      isExpertiseSection = false;
    }
    
    if (isExpertiseSection && text) {
      const paras = $(el).nextUntil("h2", "p").map((_, child) => $(child).text()).get();
      if (paras.length > 0) {
        expertiseItems.push({
          title: text,
          desc: paras.join('\n\n')
        });
      }
    }
  });

  // Extract Team Members
  const teamMembers: { name: string; subtitle: string; imageSrc: string; }[] = [];
  h2s.each((i, el) => {
    const text = $(el).text().trim();
    const nextEl = $(el).next();
    const nextNextEl = $(el).next().next();
    
    if (nextEl.is("p") && nextNextEl.is("figure")) {
      const pText = nextEl.text().toLowerCase();
      if (pText.includes("lawyer") || pText.includes("partner")) {
        let imgSrc = nextNextEl.find("img").attr("src") || "";
        if (imgSrc) imgSrc = imgSrc.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');

        teamMembers.push({
          name: text,
          subtitle: nextEl.text().trim(),
          imageSrc: imgSrc
        });
      }
    }
  });

  // Extract Testimonials ("Our clients say")
  const testimonialsHeading = h2s.filter((i, el) => $(el).text().trim().toLowerCase() === "our clients say").first();
  const testimonials: { text: string; name: string; subtitle: string; }[] = [];
  if (testimonialsHeading.length > 0) {
    let currentEl = testimonialsHeading.next();
    // Stop when we hit the final CTA h2 or run out of siblings
    while (currentEl.length > 0 && currentEl[0].tagName.toLowerCase() !== 'h2') {
      if (currentEl[0].tagName.toLowerCase() === 'p') {
        const text = currentEl.text();
        const nameEl = currentEl.next("h4");
        const subtitleEl = nameEl.next("h6");
        if (nameEl.length > 0) {
          testimonials.push({
            text: text,
            name: nameEl.text(),
            subtitle: subtitleEl.length > 0 ? subtitleEl.text() : ""
          });
          currentEl = subtitleEl; // skip ahead
        }
      }
      currentEl = currentEl.next();
    }
  }

  // Extract Final CTA
  // It's usually the very last h2, or an h2 containing 'Hire'
  const ctaHeading = h2s.filter((i, el) => $(el).text().toLowerCase().includes("hire one of our")).first();
  const ctaText = ctaHeading.length > 0 ? ctaHeading.text().trim() : "";

  // Use gallery images if available, otherwise fallback to featured image
  const heroImages = galleryImages.length > 0 ? galleryImages : (featuredImage ? [featuredImage] : []);

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white h-[calc(100vh-110px)] md:h-[calc(100vh-120px)] flex flex-col relative overflow-hidden">
        <HeroSlider images={heroImages} />
        
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end items-end p-6 lg:p-20 pb-32 lg:pb-36">
          <FadeIn className="max-w-4xl text-right" delay={0.2}>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm text-white">
              {heroTitle || (
                <>
                  Lawyers Specializing in <span className="block mt-2">Real Estate Law</span>
                </>
              )}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-[#d71921]/10 py-32 lg:py-40 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">
          <div className="md:w-1/2">
            <FadeIn>
              <h2 className="text-black text-4xl lg:text-5xl font-medium leading-tight tracking-wide drop-shadow-sm">
                {introTitle}
              </h2>
            </FadeIn>
          </div>
          <div className="md:w-1/2">
            <FadeIn delay={0.2}>
              <p className="text-[#5a6a7e] text-[15px] leading-loose mb-8 font-serif">
                {introDesc}
              </p>
              <a href="#" className="inline-flex items-center text-sm font-semibold text-black hover:text-[#d71921] transition-colors group">
                Read More 
                <span className="ml-2 w-5 h-5 rounded-full border border-black flex items-center justify-center group-hover:border-[#d71921] transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </span>
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Advisory Areas Section */}
      {advisoryItems.length > 0 && (
        <section className="bg-white py-24 px-6 lg:px-20 relative z-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
              <h2 className="font-sans text-4xl lg:text-5xl font-medium text-black tracking-tight">
                {advisoryTitle}
              </h2>
              <a href="#" className="hidden md:flex items-center text-sm font-semibold text-black hover:text-[#d71921] transition-colors group">
                See More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 py-8">
              {advisoryItems.map((item, index) => (
                <FadeIn key={index} delay={index * 0.05} className="flex items-start group cursor-pointer">
                  <span className="text-[#a0b0c0] font-serif text-sm mr-4 mt-1 shrink-0">{item.num}</span>
                  <div className="flex flex-col">
                    <h3 className="text-xl text-black font-sans font-medium mb-2 group-hover:text-[#d71921] transition-colors">{item.title}</h3>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quality Section (Pink) */}
      <section className="flex flex-col lg:flex-row w-full min-h-screen md:min-h-[calc(100vh-120px)]">
        {/* Left Side - Content */}
        <div className="lg:w-1/2 bg-[#fceef0] p-12 lg:p-24 flex flex-col justify-center">
          <FadeIn direction="right">
            <h2 className="font-sans text-3xl lg:text-4xl font-medium text-black mb-6 leading-tight">
              {qualityTitle}
            </h2>
            {qualityDesc && (
              <p className="text-[#5a6a7e] leading-loose mb-10 text-[16px] font-serif">
                {qualityDesc}
              </p>
            )}
            
            {qualityQuote && (
              <div className="border-l-2 border-[#d71921] pl-6 mb-12">
                <p className="text-black text-[15px] leading-relaxed font-medium font-sans">
                  {qualityQuote}
                </p>
              </div>
            )}
            
            <a href="#" className="font-display inline-flex items-center px-8 py-2.5 border border-black rounded-full text-[15px] font-semibold text-black hover:bg-[#d71921] hover:text-white transition-colors self-start hover:border-[#d71921]">
              Read More
            </a>
          </FadeIn>
        </div>
        
        {/* Right Side - Image */}
        <FadeIn direction="left" delay={0.2} className="lg:w-1/2 relative min-h-[400px] lg:min-h-full flex">
          {qualityImageSrc && (
            <div className="absolute inset-0 w-full h-full bg-gray-100">
              <Image 
                src={qualityImageSrc} 
                alt={qualityTitle} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </FadeIn>
      </section>

      {/* Real Estate Quality Section (Blue) */}
      <section className="flex flex-col lg:flex-row w-full min-h-screen md:min-h-[calc(100vh-120px)]">
        {/* Left Side - Image */}
        <FadeIn direction="right" delay={0.2} className="lg:w-1/2 relative min-h-[400px] lg:min-h-full flex order-2 lg:order-1">
          <div className="absolute inset-0 w-full h-full bg-gray-100">
            <Image 
              src={realEstateImageSrc} 
              alt={realEstateTitle} 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </FadeIn>

        {/* Right Side - Content */}
        <div className="lg:w-1/2 bg-[#fceef0] p-12 lg:p-24 flex flex-col justify-center order-1 lg:order-2">
          <FadeIn direction="left">
            <h2 className="font-sans text-3xl lg:text-4xl font-medium text-black mb-6 leading-tight">
              {realEstateTitle}
            </h2>
            
            {realEstateDesc && (
              <p className="text-[#5a6a7e] leading-loose mb-10 text-[16px] font-serif">
                {realEstateDesc}
              </p>
            )}
            
            {realEstateQuote && (
              <div className="border-l-2 border-[#d71921] pl-6 mb-12 space-y-4">
                <p className="text-black text-[15px] leading-relaxed font-medium font-sans">
                  {realEstateQuote}
                </p>
              </div>
            )}
            
            <a href="#" className="font-display inline-flex items-center px-8 py-2.5 border border-black rounded-full text-[15px] font-semibold text-black hover:bg-[#d71921] hover:text-white transition-colors self-start hover:border-[#d71921]">
              Read More
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Expertise List Section (News Style) */}
      {expertiseItems.length > 0 && (
        <section className="bg-white py-24 px-6 lg:px-20 max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-8">
            <h2 className="font-sans text-4xl lg:text-5xl font-medium text-black tracking-tight">
              {expertiseSectionTitle}
            </h2>
          </div>

          {/* List Content */}
          <div className="flex flex-col">
            {expertiseItems.map((item, index) => {
              const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              return (
                <FadeIn key={index} delay={index * 0.1}>
                  <Link href={`/${slug}`} className="block border-b border-gray-200 py-10 group hover:bg-[#fafafa] transition-colors -mx-6 px-6 sm:-mx-8 sm:px-8 rounded-xl cursor-pointer">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-16">
                      <div className="md:w-1/3 shrink-0">
                        <h3 className="text-xl lg:text-2xl font-bold font-sans text-black group-hover:text-[#d71921] transition-colors mt-1">
                          {item.title}
                        </h3>
                      </div>
                      <div className="md:w-2/3 flex flex-col items-start">
                        <p className="text-[#5a6a7e] font-serif leading-relaxed mb-6 whitespace-pre-wrap text-[15px]">
                          {item.desc}
                        </p>
                        <div className="font-display text-[16px] font-semibold text-black group-hover:text-[#d71921] transition-colors flex items-center">
                          Read more
                          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </section>
      )}

      {/* Team Section (Checkerboard) */}
      {teamMembers.length > 0 && (
        <section className="w-full relative z-20 bg-white">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2">
            {teamMembers.map((member, index) => {
              // Responsive checkerboard logic
              // On mobile: Image then Text (stacked)
              // On tablet (md): Alternate every member (Text,Image / Image,Text)
              const isTextFirstMd = index % 2 === 0;
              // On desktop (lg): Alternate every row (Text,Image,Text,Image / Image,Text,Image,Text)
              const isTextFirstLg = Math.floor(index / 2) % 2 === 0;
              
              const textOrderClass = `order-2 ${isTextFirstMd ? 'md:order-1' : 'md:order-2'} ${isTextFirstLg ? 'lg:order-1' : 'lg:order-2'}`;
              const imgOrderClass = `order-1 ${isTextFirstMd ? 'md:order-2' : 'md:order-1'} ${isTextFirstLg ? 'lg:order-2' : 'lg:order-1'}`;
              
              const TextBlock = (
                <div className={`bg-[#fceef0] aspect-auto md:aspect-square flex flex-col justify-center items-start py-12 px-6 md:p-8 lg:p-10 xl:p-16 relative group ${textOrderClass}`}>
                  <h3 className="text-xl lg:text-2xl font-sans font-medium text-black mb-2 leading-tight">{member.name}</h3>
                  <p className="text-[13px] lg:text-sm font-serif text-[#5a6a7e] mb-6 lg:mb-10">{member.subtitle}</p>
                  
                  <a href="#" className="w-8 h-8 shrink-0 rounded-full border border-black flex items-center justify-center group-hover:bg-[#d71921] group-hover:border-[#d71921] group-hover:text-white transition-all duration-300">
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  
                  {/* Subtle connecting line - pointing left or right depending on desktop position */}
                  <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-16 h-[1px] bg-[#d71921]/20 z-10 ${isTextFirstLg ? '-right-8' : '-left-8'}`}></div>
                </div>
              );
              
              const ImageBlock = (
                <div className={`relative aspect-square w-full h-full bg-gray-100 overflow-hidden group ${imgOrderClass}`}>
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
              
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 w-full">
                  {TextBlock}
                  {ImageBlock}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-medium text-black mb-8">
              {clientsSayTitle}
            </h2>
            <div className="w-full h-px bg-[#e5e7eb] mb-12"></div>
            <TestimonialSlider testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* FINAL CTA SECTION */}
      {ctaText && (
        <section className="py-20 px-4 bg-[#fceef0]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-10">
            <h2 className="text-3xl md:text-4xl font-sans font-medium text-black text-center md:text-left flex-1 md:pl-20">
              {ctaText}
            </h2>
            <div className="md:pr-20">
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-3 rounded-full border border-black text-black font-sans font-medium hover:bg-[#d71921] hover:text-white transition-colors hover:border-[#d71921]">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
