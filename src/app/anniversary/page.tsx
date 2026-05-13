import React from "react";
import { Metadata } from "next";
import { getAnniversaryPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import Image from "next/image";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";
import InterviewsSlider from "@/components/InterviewsSlider";
import GalleryMarquee from "@/components/GalleryMarquee";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getAnniversaryPage();
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

export default async function Anniversary() {
  const pageData = await getAnniversaryPage();

  if (!pageData) {
    return <div className="p-20 text-center text-red-500">Error: Page not found in WordPress</div>;
  }

  const $ = cheerio.load(pageData.content);

  // 1. Intro Text
  const introText = $("h2").first().text().trim();

  // 2. Main Video
  const mainVideoSrc = $("figure.wp-block-video").first().find("video").attr("src") || "";

  // 3. Interviews
  const interviews: { videoSrc: string; name: string }[] = [];
  
  // The first video is the main one. The interviews start after it.
  $("figure.wp-block-video").each((i, el) => {
    if (i === 0) return; // Skip main video
    
    const videoSrc = $(el).find("video").attr("src") || "";
    // The name is in the next sibling <p> tag
    const name = $(el).next("p").text().trim();
    
    if (videoSrc) {
      interviews.push({ videoSrc, name });
    }
  });

  // 4. Photo Gallery
  const galleryImages: string[] = [];
  $("figure.wp-block-image img").each((_, el) => {
    let src = $(el).attr("src");
    if (src) {
      // Clean up sizing suffixes if present to get high-res images
      src = src.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
      galleryImages.push(src);
    }
  });

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white pb-20">
      <Header />

      {/* Hero Section */}
      <section className="bg-white pt-28 pb-12 px-6 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h1 className="text-4xl lg:text-5xl font-sans font-medium text-black tracking-tight mb-8">
              60 Years of ENGIN DENIZ
            </h1>
            <p className="text-[#5a6a7e] text-lg lg:text-xl leading-relaxed font-serif italic">
              "{introText}"
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Feature Video */}
      {mainVideoSrc && (
        <section className="px-6 lg:px-20 pb-20">
          <FadeIn delay={0.2}>
            <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <video 
                className="w-full h-auto aspect-video object-cover"
                controls 
                preload="metadata"
                src={`${mainVideoSrc}#t=1.0`}
              />
            </div>
          </FadeIn>
        </section>
      )}

      {/* Interviews Slider */}
      {interviews.length > 0 && (
        <section className="py-24 bg-[#fae8e8]">
          <FadeIn>
            <InterviewsSlider interviews={interviews} />
          </FadeIn>
        </section>
      )}

      {/* Photo Gallery Marquee */}
      {galleryImages.length > 0 && (
        <section className="pt-24 pb-12">
          <FadeIn>
            <GalleryMarquee images={galleryImages} />
          </FadeIn>
        </section>
      )}
    </main>
  );
}
