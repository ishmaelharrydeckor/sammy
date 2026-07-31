import type { Metadata } from "next";
import ConsultingPageClient from "./ConsultingPageClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.samueladanuvo.com"),
  title: "90-Day Business Growth Consulting | Samuel Adanuvo",
  description: "Stuck in the survival loop? Get a full business model audit, a custom 90-day growth roadmap, and weekly strategic advisory sessions built for African markets.",
  openGraph: {
    title: "90-Day Business Growth Consulting | Samuel Adanuvo",
    description: "Stuck in the survival loop? Get a full business model audit, a custom 90-day growth roadmap, and weekly strategic advisory sessions built for African markets.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samuel Adanuvo - 90-Day Business Growth Consulting",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "90-Day Business Growth Consulting | Samuel Adanuvo",
    description: "Stuck in the survival loop? Get a full business model audit, a custom 90-day growth roadmap, and weekly strategic advisory sessions built for African markets.",
    images: ["/images/og-image.png"],
  },
};

export default function Page() {
  return <ConsultingPageClient />;
}
