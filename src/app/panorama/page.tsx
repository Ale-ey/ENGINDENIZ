import React from "react";
import { Metadata } from "next";
import { getPanoramaPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import Image from "next/image";
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
  imageSrc?: string;
  videoSrc?: string;
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
  
  $("h3").each((_, el) => {
    const $h3 = $(el);
    const title = $h3.text().trim();
    let category = "";
    let imageSrc = "";
    let videoSrc = "";
    const paragraphs: string[] = [];

    // Traverse next siblings until the next h3
    let nextNode = $h3.next();
    while (nextNode.length > 0 && nextNode[0].name !== "h3") {
      const nodeName = nextNode[0].name;

      if (nodeName === "h4") {
        category = nextNode.text().trim();
      } else if (nodeName === "figure") {
        const img = nextNode.find("img");
        if (img.length > 0) {
          imageSrc = img.attr("src") || "";
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
      } else if (nodeName === "p") {
        const text = nextNode.text().trim();
        // Ignore the very first paragraph if it's identical to the introtext
        if (text && text !== category && text !== introText) {
          paragraphs.push(text);
        }
      }

      nextNode = nextNode.next();
    }

    if (title) {
      articles.push({ title, category, imageSrc, videoSrc, paragraphs });
    }
  });

  return (
    <main className="min-h-screen bg-[#fafafa] selection:bg-[#D71921] selection:text-white pb-20">
      <Header />

      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 px-6 lg:px-20 text-center border-b border-gray-100 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fae8e8]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h1 className="text-4xl lg:text-5xl font-sans font-medium text-black tracking-tight mb-8">
              Panorama
            </h1>
            <p className="text-[#5a6a7e] text-lg lg:text-xl leading-relaxed font-serif italic">
              "{introText}"
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
            {articles.map((article, idx) => (
              <FadeIn key={idx} delay={(idx % 3) * 0.1}>
                <div className="flex flex-col h-full group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Media Container */}
                  <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden relative">
                    {article.videoSrc ? (
                      <video 
                        className="w-full h-full object-cover"
                        controls 
                        preload="metadata"
                        src={article.videoSrc}
                      />
                    ) : article.imageSrc ? (
                      <Image
                        src={article.imageSrc}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#fae8e8]/50">
                        <div className="w-16 h-16 rounded-full bg-[#fae8e8] flex items-center justify-center mb-4">
                          <span className="text-[#c31524] font-serif text-2xl font-bold">ED</span>
                        </div>
                        <span className="text-[#c31524]/60 font-serif italic text-lg">News & Updates</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Container */}
                  <div className="flex flex-col flex-1 p-8">
                    {article.category && (
                      <div className="mb-4 flex items-center">
                        <span className="px-3 py-1 bg-[#fae8e8] text-[#c31524] text-xs font-sans font-bold uppercase tracking-wider rounded-full">
                          {article.category}
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-sans font-medium text-black leading-tight mb-4 group-hover:text-[#c31524] transition-colors">
                      {article.title}
                    </h3>
                    
                    <div className="text-[#5a6a7e] font-serif text-base leading-relaxed flex-1">
                      {article.paragraphs.slice(0, 1).map((p, pIdx) => (
                        <p key={pIdx} className="line-clamp-4">{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
