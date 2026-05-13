import React from "react";
import { Metadata } from "next";
import { getPrivacyPolicyPage } from "@/lib/graphql";
import * as cheerio from "cheerio";
import Header from "@/components/Header";
import { FadeIn } from "@/components/FadeIn";
import parse from "html-react-parser";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPrivacyPolicyPage();
  if (!pageData || !pageData.seo) return {};

  const { seo } = pageData;
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonicalUrl,
    },
  };
}

export default async function PrivacyPolicyPage() {
  const pageData = await getPrivacyPolicyPage();

  if (!pageData) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 px-6 text-center text-red-500">Error: Page not found in WordPress. Please ensure a page named "Privacy Policy" exists.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white selection:bg-[#D71921] selection:text-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#fae8e8] pt-32 pb-16 md:pt-40 md:pb-24 px-6 lg:px-20 w-full flex items-center justify-start relative">
        <div className="max-w-4xl mx-auto w-full text-center">
          <FadeIn delay={0.1} direction="up" className="z-10">
            <h1 className="text-4xl md:text-5xl font-sans font-medium text-black">
              {pageData.title || "Privacy Policy"}
            </h1>
          </FadeIn>
        </div>
      </section>

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
              {parse(pageData.content)}
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
