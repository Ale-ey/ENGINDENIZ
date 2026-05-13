import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import * as cheerio from "cheerio";
import { getPageBySlug } from "@/lib/graphql";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getPageBySlug(slug);
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

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = await getPageBySlug(slug);

  if (!pageData) {
    notFound();
  }

  const featuredImage = pageData.featuredImage?.node?.sourceUrl;

  // Clean up WordPress content to avoid duplicating the title and featured image
  const $ = cheerio.load(pageData.content);
  
  // Remove h1/h2 that match the title
  $('h1, h2').each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text === pageData.title.toLowerCase()) {
      $(el).remove();
    }
  });

  // Remove the figure containing the featured image if it exists in the content
  if (featuredImage) {
    $('figure').each((_, el) => {
      const imgSrc = $(el).find('img').attr('src');
      if (imgSrc && featuredImage.includes(imgSrc.split('?')[0])) {
        $(el).remove();
      }
    });
  }

  const cleanedContent = $('body').html() || $.html();

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-[#fae8e8] pt-32 pb-16 px-6 lg:px-20 relative">
        <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row items-center justify-center min-h-[60px]">
          <FadeIn className="w-full text-center">
            <h1 className="text-4xl lg:text-5xl font-sans font-medium text-black tracking-tight mb-2 md:mb-0">
              {pageData.title}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Featured Image if exists */}
      {featuredImage && (
        <section className="w-full px-6 lg:px-20 mb-16">
          <div className="max-w-5xl mx-auto relative h-[400px] overflow-hidden shadow-sm">
            <Image 
              src={featuredImage} 
              alt={pageData.title} 
              fill 
              className="object-cover" 
            />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="w-full px-6 lg:px-20 py-16 md:py-24 bg-[#f5f5f5] flex justify-center">
        <div className="max-w-4xl w-full">
          <FadeIn delay={0.2} direction="up">
            <div className="prose prose-lg max-w-none 
              prose-headings:font-sans prose-headings:font-bold prose-headings:text-[#333] prose-headings:mb-6 prose-headings:mt-10
              prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
              prose-p:font-sans prose-p:text-[#4a4a4a] prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-[#e40037] prose-a:font-medium prose-a:no-underline [&_a:hover]:underline prose-a:transition-all
              prose-ul:list-none prose-ul:pl-0 prose-ul:mb-6
              prose-li:font-sans prose-li:text-[#4a4a4a] prose-li:mb-2 prose-li:relative prose-li:pl-6 
              marker:prose-li:hidden
              [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-2.5 [&>ul>li]:before:w-1.5 [&>ul>li]:before:h-1.5 [&>ul>li]:before:bg-[#e40037] [&>ul>li]:before:rounded-full
              prose-strong:text-[#e40037] prose-strong:font-bold">
              {parse(cleanedContent)}
            </div>
            <div className="mt-16 pt-8 border-t border-gray-200 flex justify-center md:justify-start">
              <BackButton />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
