import type { Metadata } from "next";
import { Lato, Crimson_Text, Raleway } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" });
const crimsonText = Crimson_Text({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-crimson" });
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: {
    template: "%s | ENGINDENIZ",
    default: "ENGINDENIZ",
  },
  description: "Leading specialist law firm for real estate",
  icons: {
    icon: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${lato.variable} ${crimsonText.variable} ${raleway.variable} font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen overflow-x-hidden`}>
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
