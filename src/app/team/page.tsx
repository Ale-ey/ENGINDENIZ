import React from "react";
import { Metadata } from "next";
import { getTeamPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import Image from "next/image";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getTeamPage();
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

export default async function TeamPage() {
  const pageData = await getTeamPage();

  if (!pageData) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="p-20 text-center text-red-500">Error: Team Page not found in WordPress. Please ensure a page named "Team" exists.</div>
      </main>
    );
  }

  const $ = cheerio.load(pageData.content);

  // Extract Hero Title from content (like an h1 or the first paragraph if it matches)
  let heroTitle = $("h1").first().text().trim();
  if (!heroTitle) {
    // Sometimes WordPress users put the main title in an h2
    const firstH2 = $("h2").first().text().trim();
    if (firstH2.toLowerCase() === "our team" || firstH2.toLowerCase() === "team") {
      heroTitle = firstH2;
    }
  }

  // Parse team members based on H2 headings
  const teamMembers: any[] = [];

  $("h2").each((i, el) => {
    const name = $(el).text().trim();
    // Skip empty names or the main page title if accidentally wrapped in H2
    if (!name || name.toLowerCase() === "our team" || name.toLowerCase() === "team") return;

    let current = $(el).next();
    
    let subtitle = "";
    let intro = "";
    let bodyParas: string[] = [];
    let expertiseTitle = "";
    let expertiseList: string[] = [];
    let imageSrc = "";

    // 1. Get subtitle (first p)
    if (current.is("p")) {
      subtitle = current.text().trim();
      current = current.next();
    }

    // 2. Iterate siblings until next h2
    while (current.length && !current.is("h2")) {
      // Find Image
      if (current.is("figure") || current.find("img").length > 0) {
        const img = current.is("img") ? current : current.find("img").first();
        let src = img.attr("src") || "";
        // Strip WP scaling
        if (src) src = src.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
        if (!imageSrc) imageSrc = src;
      }
      // Find List (Expertise)
      else if (current.is("ul")) {
        current.find("li").each((_, li) => {
          expertiseList.push($(li).text().trim());
        });
      }
      // Find Paragraphs
      else if (current.is("p")) {
        const text = current.text().trim();
        if (text) {
          // If the paragraph comes right before a UL, it might be the expertise title (e.g. "Lawyer")
          if (current.next().is("ul")) {
            expertiseTitle = text;
          } else if (!intro && current.find("strong, b").length > 0) {
            intro = text;
          } else {
            bodyParas.push(text);
          }
        }
      }
      // Or headers for expertise title
      else if (current.is("h3, h4, h5, h6")) {
        expertiseTitle = current.text().trim();
      }

      current = current.next();
    }

    teamMembers.push({
      name,
      subtitle,
      intro,
      bodyParas,
      expertiseTitle,
      expertiseList,
      imageSrc
    });
  });

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#fae8e8] py-32 md:py-40 px-6 lg:px-20 w-full flex items-center justify-center relative">
        <FadeIn delay={0.1} direction="up" className="z-10">
          <h1 className="text-4xl md:text-5xl font-sans font-medium text-black text-center">
            {heroTitle || pageData.title || "Our Team"}
          </h1>
        </FadeIn>
      </section>

      {/* Team Members */}
      <section className="w-full flex flex-col">
        {teamMembers.map((member, index) => {
          const isTextFirst = index % 2 === 0;

          // Horizontal connecting line
          const connectingLine = (
            <div className={`hidden lg:block absolute top-1/2 w-24 h-px bg-gray-300 z-10 ${
              isTextFirst ? "-right-12" : "-left-12"
            }`}></div>
          );

          return (
            <div key={index} className="flex flex-col lg:flex-row w-full min-h-screen lg:min-h-[600px] border-b border-gray-100">
              
              {/* Text Block */}
              <div className={`w-full lg:w-1/2 p-10 lg:p-24 xl:p-32 flex flex-col justify-center relative ${
                isTextFirst ? "order-2 lg:order-1" : "order-2 lg:order-2"
              }`}>
                <FadeIn direction={isTextFirst ? "right" : "left"} delay={0.1} className="w-full flex flex-col">
                  <h2 className="text-3xl lg:text-4xl font-sans font-medium text-black mb-1">{member.name}</h2>
                  {member.subtitle && (
                    <p className="text-[#d71921] font-sans text-sm mb-12">{member.subtitle}</p>
                  )}

                  {member.intro && (
                    <p className="font-sans font-medium text-black text-[17px] leading-relaxed mb-8">
                      {member.intro}
                    </p>
                  )}

                  {member.bodyParas.map((para: string, i: number) => (
                    <p key={i} className="text-[#5a6a7e] font-serif text-[15px] leading-loose mb-6">
                      {para}
                    </p>
                  ))}

                  {member.expertiseTitle && (
                    <h4 className="font-sans font-medium text-black text-lg mt-8 mb-4">{member.expertiseTitle}</h4>
                  )}

                  {member.expertiseList.length > 0 && (
                    <ul className="text-[#5a6a7e] font-serif text-[14px] leading-loose list-disc pl-5">
                      {member.expertiseList.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </FadeIn>

                {connectingLine}
              </div>

              {/* Image Block */}
              <div className={`w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto bg-gray-100 ${
                isTextFirst ? "order-1 lg:order-2" : "order-1 lg:order-1"
              }`}>
                <FadeIn direction={isTextFirst ? "left" : "right"} delay={0.2} className="w-full h-full absolute inset-0">
                  {member.imageSrc ? (
                    <Image 
                      src={member.imageSrc} 
                      alt={member.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-sans">
                      No Image Found
                    </div>
                  )}
                </FadeIn>
              </div>

            </div>
          );
        })}

        {teamMembers.length === 0 && (
          <div className="py-32 px-6 text-center text-[#5a6a7e] font-serif">
            No team members found. Please add members starting with an H2 heading in WordPress.
          </div>
        )}
      </section>
    </main>
  );
}
