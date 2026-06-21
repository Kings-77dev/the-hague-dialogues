import type { Metadata } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { client } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/sanity/queries";
import { SITE_URL } from "@/lib/site";
import { urlFor } from "@/sanity/image";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(SETTINGS_QUERY);
  const ogImg = settings?.defaultOgImage
    ? urlFor(settings.defaultOgImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings?.title ?? "The Hague Dialogues",
      template: "%s — The Hague Dialogues",
    },
    description:
      settings?.tagline ??
      "A student-led platform in The Hague creating spaces for open, challenging, and constructive conversations.",
    openGraph: {
      type: "website",
      siteName: settings?.title ?? "The Hague Dialogues",
      url: SITE_URL,
      title: settings?.title ?? "The Hague Dialogues",
      description: settings?.tagline ?? undefined,
      ...(ogImg ? { images: [{ url: ogImg, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.title ?? "The Hague Dialogues",
      description: settings?.tagline ?? undefined,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch(SETTINGS_QUERY);
  const donateHref = settings?.supportUrl ?? "/get-involved";

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${dmSans.variable} antialiased`}
    >
      <body>
        <Header donateHref={donateHref} />
        <main>{children}</main>
        <Footer settings={settings} donateHref={donateHref} />
      </body>
    </html>
  );
}
