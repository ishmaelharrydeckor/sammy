import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.samueladanuvo.com"),
  title: "Samuel Adanuvo | CEO, Author & Entrepreneur Educator",
  description: "Samuel works with young Africans who are done waiting for permission to build wealth. CEO of Outbrooks Technology Limited, Founder of Sigmart YAE, and Author of The Economy of the Young African Mind.",
  openGraph: {
    title: "Samuel Adanuvo | CEO, Author & Entrepreneur Educator",
    description: "Equipping young Africans with the mental frameworks, economic realities, and systems required to build real wealth, not just income.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samuel Adanuvo - CEO, Author & Entrepreneur Educator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samuel Adanuvo | CEO, Author & Entrepreneur Educator",
    description: "Equipping young Africans with the mental frameworks, economic realities, and systems required to build real wealth, not just income.",
    images: ["/images/og-image.png"],
  },
};

export default function Page() {
  return <HomePageClient />;
}
