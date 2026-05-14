import React from "react";
import { Metadata } from "next";
import { getPanoramaPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPanoramaPage();
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

interface Article {
  title: string;
  category: string;
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  videoSrc: string;
  readMoreUrl?: string;
  paragraphs: string[];
}

export default async function Panorama() {
  const pageData = await getPanoramaPage();

  if (!pageData) {
    return <div className="p-20 text-center text-red-500">Error: Page not found in WordPress</div>;
  }

  const $ = cheerio.load(pageData.content);

  // 1. Intro Text
  const introText = $("p").first().text().trim();

  // 2. Parse Articles
  const articles: Article[] = [];
  
  $("h2, h3").each((_, el) => {
    const $heading = $(el);
    const title = $heading.text().trim();
    let category = "";
    let imageSrc = "";
    let imageWidth = 0;
    let imageHeight = 0;
    let videoSrc = "";
    let readMoreUrl = "";
    const paragraphs: string[] = [];

    // Traverse next siblings until the next h2 or h3
    let nextNode = $heading.next();
    while (nextNode.length > 0 && !nextNode[0].name.match(/^h[23]$/i)) {
      const nodeName = nextNode[0].name;

      if (nodeName === "h4" || nodeName === "p") {
        if (nodeName === "h4") {
          category = nextNode.text().trim();
        } else if (nodeName === "p") {
          const textStr = nextNode.text().trim();
          const htmlContent = nextNode.html()?.trim() || "";
          
          // Try to extract a link if there is one
          const link = nextNode.find("a").first();
          if (link.length > 0 && !readMoreUrl) {
            readMoreUrl = link.attr("href") || "";
          }

          if (textStr && textStr !== category && textStr !== introText) {
            // If it's a short paragraph right after the title and no category is set, treat it as a category
            if (!category && textStr.length < 50 && paragraphs.length === 0 && !htmlContent.includes("<br")) {
              category = textStr;
            } else {
              paragraphs.push(htmlContent);
            }
          }
        }
      } else if (nodeName === "figure") {
        const img = nextNode.find("img");
        if (img.length > 0) {
          imageSrc = img.attr("src") || "";
          imageWidth = parseInt(img.attr("width") || "0", 10);
          imageHeight = parseInt(img.attr("height") || "0", 10);
          // Clean up sizing suffixes for high-res images
          imageSrc = imageSrc.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
        }
        
        const video = nextNode.find("video");
        if (video.length > 0) {
          videoSrc = video.attr("src") || "";
          if (videoSrc) {
            videoSrc += "#t=1.0"; // Force thumbnail for videos
          }
        }
      }

      nextNode = nextNode.next();
    }

    if (title) {
      articles.push({ title, category, imageSrc, imageWidth, imageHeight, videoSrc, readMoreUrl, paragraphs });
    }
  });

  return (
    <main className="min-h-screen bg-[#fafafa] selection:bg-[#D71921] selection:text-white pb-20">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#fae8e8] pt-32 pb-20 px-6 lg:px-20 text-center relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h1 className="text-4xl lg:text-5xl font-sans font-medium text-black tracking-tight mb-8">
              {pageData.title}
            </h1>
            <p className="text-[#5a6a7e] text-lg lg:text-xl leading-relaxed font-serif italic">
              "{introText}"
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Articles List */}
      <section className="px-6 lg:px-20 py-24 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col">
          {articles.map((article, idx) => {
            // Find the correct link using fuzzy substring matching
            let linkHref = article.readMoreUrl || "#";
            const titleLower = article.title.toLowerCase();

            if (titleLower.includes("due diligence") || titleLower.includes("pruefpflicht")) {
              linkHref = "https://www.engin-deniz.at/downloads/Pruefpflicht-Immobilienmakler-2024-Stefan-Heil-V2.pdf";
            } else if (titleLower.includes("building code") || titleLower.includes("bauordnung")) {
              linkHref = "https://www.engin-deniz.at/downloads/Bauordnungsnovelle-2023--Stefan-Heil-V2.pdf";
            } else if (titleLower.includes("top lawyers") || titleLower.includes("voting")) {
              linkHref = "https://www.engin-deniz.at/downloads/2021-04-Immobilien-Magazin.pdf";
            } else if (titleLower.includes("gewinn") || titleLower.includes("magazine 04-2019")) {
              linkHref = "https://www.engin-deniz.at/downloads/2019-04-Gewinn-Magazin--Bauordnung.pdf";
            } else if (titleLower.includes("newsletter 2019-01")) {
              linkHref = "https://www.engin-deniz.at/downloads/EDR-Newsletter-2018-01.pdf";
            } else if (titleLower.includes("newsletter 2018-01")) {
              linkHref = "https://www.engin-deniz.at/downloads/EDR-Newsletter-2018-01.pdf";
            } else if (titleLower.includes("real estate focus") || titleLower.includes("immofokus")) {
              linkHref = "https://www.engin-deniz.at/downloads/2018-03-ImmoFokus.pdf";
            } else if (titleLower.includes("newsletter-02")) {
              linkHref = "https://www.engin-deniz.at/downloads/EDR-Newsletter-2017-02.pdf";
            } else if (titleLower.includes("newsletter-01")) {
              linkHref = "https://www.engin-deniz.at/downloads/EDR-Newsletter-2017-01-web.pdf";
            } else if (titleLower.includes("övi") || titleLower.includes("vi news")) {
              linkHref = "https://www.engin-deniz.at/downloads/OeVI-News--2017-01-S16-17.pdf";
            } else if (titleLower.includes("immo-kurier")) {
              linkHref = "https://www.engin-deniz.at/downloads/2017-02-11--Immo-Kurier.pdf";
            } else if (titleLower.includes("international award") || titleLower.includes("internationale auszeichnung")) {
              linkHref = "https://www.immobilien-magazin.at/artikel/ehre_zum_tag_reimitz_bester_immo-anwalt/2015.4715/";
            } else if (titleLower.includes("real estate & vat") || titleLower.includes("umsatzsteuer")) {
              linkHref = "https://www.engin-deniz.at/downloads/Immobilien-Magazin--Stabilitaetsgesetz.pdf";
            } else if (titleLower.includes("top 500")) {
              linkHref = "https://www.engin-deniz.at/downloads/Immobilien-Magazin-2014-02--Top-500.pdf";
            } else if (titleLower.includes("stability act") || titleLower.includes("stabilitätsgesetz")) {
              linkHref = "https://www.engin-deniz.at/downloads/OVI-News-2013-03-Stabilitaetsgesetz.pdf";
            } else if (titleLower.includes("dr. house") || titleLower.includes("dr. haus")) {
              linkHref = "https://www.engin-deniz.at/downloads/Dr-Haus-2012-09-Editorial.pdf";
            }

            // It's a split-layout article if it has an image, NO video, and the image is PORTRAIT.
            // If the image width is greater than height, it's a landscape image, so we render it full-width.
            const isPortrait = !article.imageWidth || !article.imageHeight || article.imageWidth <= article.imageHeight;
            const isArticle = !!article.imageSrc && !article.videoSrc && isPortrait;

            if (isArticle) {
              return (
                <FadeIn key={idx} delay={0.1}>
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 py-14 px-8 md:px-16 my-16 bg-[#fafafa] border-t-4 border-[#e40037] relative shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                    {/* Subtle Background Accent */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#fae8e8] opacity-50 blur-3xl rounded-full -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                    
                    {/* Left Side: Media */}
                    <div className="w-full md:w-3/12 overflow-hidden flex-shrink-0 relative z-10 flex justify-start items-start">
                      <img
                        src={article.imageSrc}
                        alt={article.title}
                        loading="lazy"
                        className="w-full max-w-[280px] h-auto object-contain shadow-sm group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Right Side: Content */}
                    <div className="w-full md:w-9/12 flex flex-col justify-start relative z-10">
                      {/* Category */}
                      {article.category && (
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-px bg-[#e40037]"></div>
                          <span className="text-[#e40037] font-sans font-bold uppercase tracking-widest text-[11px]">
                            {article.category}
                          </span>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-3xl md:text-[34px] font-sans font-medium text-[#111] leading-tight mb-6">
                        {article.title}
                      </h3>
                      
                      {/* Content (All paragraphs) */}
                      <div className="text-[#5a6a7e] font-sans text-lg leading-[1.8] mb-8 space-y-6 wp-parsed-content">
                        {article.paragraphs.map((p, pIdx) => (
                          <div key={pIdx}>{parse(p)}</div>
                        ))}
                      </div>
                      
                      {/* Read More Button */}
                      <div className="mt-auto pt-4">
                        <Link href={linkHref} target={linkHref !== "#" ? "_blank" : undefined} rel={linkHref !== "#" ? "noopener noreferrer" : undefined} className="inline-flex items-center text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#111] hover:text-[#e40037] transition-colors pb-1 border-b-2 border-transparent hover:border-[#e40037]">
                          <span className="mr-3">Read More</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            }

            // Text or Video Block (Full Width)
            return (
              <FadeIn key={idx} delay={0.1}>
                <div className="flex flex-col py-14 px-8 md:px-16 my-16 bg-[#fafafa] border-t-4 border-[#e40037] relative shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#fae8e8] opacity-50 blur-3xl rounded-full -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                  
                  <div className="relative z-10 w-full">
                    {/* Category */}
                    {article.category && (
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-px bg-[#e40037]"></div>
                        <span className="text-[#e40037] font-sans font-bold uppercase tracking-widest text-[11px]">
                          {article.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-3xl md:text-[34px] font-sans font-medium text-[#111] leading-tight mb-8">
                      {article.title}
                    </h3>
                    
                    {/* Media */}
                    {article.videoSrc ? (
                      <div className="w-full mb-10 shadow-lg relative bg-black border border-gray-100 flex justify-center">
                        <video 
                          className="w-full h-auto max-h-[600px] object-contain"
                          controls 
                          preload="metadata"
                          src={article.videoSrc}
                        />
                      </div>
                    ) : article.imageSrc ? (
                      <div className="w-full mb-10 shadow-lg relative rounded-md overflow-hidden flex justify-center bg-transparent">
                        <img 
                          className="w-full max-h-[500px] object-cover"
                          src={article.imageSrc}
                          alt={article.title}
                          loading="lazy"
                        />
                      </div>
                    ) : null}

                    {/* Content */}
                    <div className="text-[#5a6a7e] font-sans text-lg leading-[1.8] space-y-6 wp-parsed-content">
                      {article.paragraphs.map((p, pIdx) => (
                        <div key={pIdx}>{parse(p)}</div>
                      ))}
                    </div>

                    {/* Read More Button (if a link exists) */}
                    {linkHref !== "#" && (
                      <div className="mt-8 pt-4">
                        <Link href={linkHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#111] hover:text-[#e40037] transition-colors pb-1 border-b-2 border-transparent hover:border-[#e40037]">
                          <span className="mr-3">Read More</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
          
          {articles.length === 0 && (
            <div className="text-center py-20 text-gray-500 font-serif">No articles found.</div>
          )}
        </div>
      </section>
    </main>
  );
}
