import React from "react";
import { Metadata } from "next";
import { getRealEstateLawPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";
import CardsSlider from "@/components/CardsSlider";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getRealEstateLawPage();
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

export default async function RealEstateLaw() {
  const pageData = await getRealEstateLawPage();

  if (!pageData) {
    return <div className="p-20 text-center text-red-500">Error: Page not found in WordPress</div>;
  }

  const $ = cheerio.load(pageData.content);

  // Extract the main hero title and description
  // In the content, the first h2 is a paragraph-like text.
  const introHeadingText = $("h2").first().text();
  
  // Extract pairs of h2 and figure
  const cards: { title: string; imageSrc: string; href: string }[] = [];
  
  $("h2").each((i, el) => {
    if (i === 0) return; // Skip the first one as it's the intro text
    
    const title = $(el).text().trim();
    let imageSrc = $(el).nextUntil("h2", "figure").find("img").attr("src") || "";
    if (imageSrc) {
      imageSrc = imageSrc.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, ''); // Remove thumbnail sizing
    }
    
    if (title && imageSrc) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      cards.push({ title, imageSrc, href: `/${slug}` });
    }
  });

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white">
      <Header />

      {/* Intro Hero Section */}
      <section className="bg-white pt-40 pb-20 px-6 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h1 className="text-4xl lg:text-5xl font-sans font-medium text-black tracking-tight mb-8">
              {pageData.title}
            </h1>
            <p className="text-[#5a6a7e] text-lg lg:text-xl leading-relaxed font-serif">
              {introHeadingText}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Slider of Cards */}
      <section className="w-full pb-20">
        <FadeIn delay={0.2}>
          <CardsSlider cards={cards} />
        </FadeIn>
      </section>

    </main>
  );
}
