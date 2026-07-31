import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Samuel Adanuvo | CEO, Author & Entrepreneur Educator",
  description: "Samuel works with young Africans who are done waiting for permission to build wealth. CEO of Outbrooks Technology Limited, Founder of Sigmart YAE, and Author of The Economy of the Young African Mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark scroll-smooth scroll-pt-16`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-active')`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://www.samueladanuvo.com/#person",
                  "name": "Samuel Adanuvo",
                  "jobTitle": "CEO & Entrepreneur Educator",
                  "url": "https://www.samueladanuvo.com",
                  "sameAs": [
                    "https://www.linkedin.com/in/dr-samuel-adanuvo-a76955210",
                    "https://www.instagram.com/sammy_adanuvo",
                    "https://youtube.com/@sammyadanuvo",
                    "https://www.tiktok.com/@sammy_adanuvo",
                    "https://www.facebook.com/share/1MAESjaEMo/"
                  ],
                  "worksFor": {
                    "@id": "https://www.samueladanuvo.com/#organization"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.samueladanuvo.com/#organization",
                  "name": "Outbrooks Technology Limited",
                  "url": "https://www.samueladanuvo.com",
                  "logo": "https://www.samueladanuvo.com/images/og-image.png",
                  "employee": {
                    "@id": "https://www.samueladanuvo.com/#person"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-[#E2E2E2] font-sans selection:bg-accent/20">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
