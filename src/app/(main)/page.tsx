import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.samueladanuvo.com"),
  title: "Samuel Adanuvo | CEO, Author & Keynote Speaker",
  description: "The literal cheat code for business growth. Samuel Adanuvo leads Outbrooks Consult, the high growth marketing agency that helps businesses and organizations scale exponentially through better digital marketing systems.",
  openGraph: {
    title: "Samuel Adanuvo | CEO, Outbrooks Consult",
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
