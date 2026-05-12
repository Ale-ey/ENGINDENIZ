const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const parseStart = code.indexOf('  // Hero Section');
const parseEnd = code.indexOf('  // Extract Footer');

if (parseStart !== -1 && parseEnd !== -1) {
  const newParseLogic = `  // Hero Section
  const heroTitle = $("h1").first().text() || pageData.title;

  // Dynamic H2 Sections
  const h2s = $("h2");
  
  // Section 1: Intro
  const introTitle = h2s.eq(0).text() || "We are legal experts.";
  const introDesc = h2s.eq(0).nextUntil("h2", "p").first().text() || $("p").first().text();

  // Section 2: Quality (Pink)
  const qualityTitle = h2s.eq(1).text() || "Quality";
  const qualityParas = h2s.eq(1).nextUntil("h2", "p").map((_, el) => $(el).text()).get();
  const qualityDesc = qualityParas[0] || "";
  const qualityQuote = qualityParas[1] || "";
  const qualityImageSrc = h2s.eq(1).nextUntil("h2", "figure").find("img").attr("src") || galleryImages[0] || "";

  // Section 3: Real Estate Quality (Blue)
  const realEstateTitle = h2s.eq(2).text() || "Real Estate Quality";
  const realEstateParas = h2s.eq(2).nextUntil("h2", "p").map((_, el) => $(el).text()).get();
  const realEstateDesc = realEstateParas[0] || "";
  const realEstateQuote = realEstateParas[1] || "";
  const realEstateImageSrc = h2s.eq(2).nextUntil("h2", "figure").find("img").attr("src") || galleryImages[1] || "";

  // Extract Engagement & Success (3rd and 4th H2)
  const engagementTitle = h2s.eq(2).text();
  const engagementDesc1 = h2s.eq(2).nextAll("p").eq(0).text();
  const engagementDesc2 = h2s.eq(2).nextAll("p").eq(1).text();

  const successTitle = h2s.eq(3).text();
  const successDesc1 = h2s.eq(3).nextAll("p").eq(0).text();
  const successDesc2 = h2s.eq(3).nextAll("p").eq(1).text();

  // Extract History (5th H2)
  const historyHeading = h2s.eq(4).text();
  const historyTitle = h2s.eq(4).nextAll("p").eq(0).text();
  const historyDesc1 = h2s.eq(4).nextAll("p").eq(1).text();
  const historyDesc2 = h2s.eq(4).nextAll("p").eq(2).text();

  // Extract Contact (6th H2)
  const contactTitle = h2s.eq(5).text();
  const contactDesc = h2s.eq(5).nextAll("p").eq(0).text().replace("Book an Appointment", "");

`;
  code = code.substring(0, parseStart) + newParseLogic + code.substring(parseEnd);
} else {
  console.log('Parse logic markers not found!');
}

const jsxStart = code.indexOf('      {/* Intro Section */}');
const jsxEnd = code.indexOf('    </main>');

if (jsxStart !== -1 && jsxEnd !== -1) {
  const newJsxLogic = `      {/* Intro Section */}
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
            
            <a href="#" className="inline-flex items-center px-8 py-2.5 border border-black rounded-full text-[15px] font-medium text-[#1c4874] hover:bg-[#1c4874] hover:text-white transition-colors self-start hover:border-[#1c4874]">
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
            
            <a href="#" className="inline-flex items-center px-8 py-2.5 border border-black rounded-full text-[15px] font-medium text-[#1c4874] hover:bg-[#1c4874] hover:text-white transition-colors self-start hover:border-[#1c4874]">
              Read More
            </a>
          </FadeIn>
        </div>
      </section>
`;
  code = code.substring(0, jsxStart) + newJsxLogic + code.substring(jsxEnd);
} else {
  console.log('JSX logic markers not found!');
}

fs.writeFileSync('src/app/page.tsx', code);
console.log('done!');
