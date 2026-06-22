import type { Metadata } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { client } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/sanity/queries";
import { SITE_URL } from "@/lib/site";
import { DEFAULTS } from "@/lib/defaults";
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
  const siteTitle = settings?.title ?? DEFAULTS.siteTitle;
  const tagline = settings?.tagline ?? DEFAULTS.siteTagline;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s — ${siteTitle}`,
    },
    description: tagline,
    openGraph: {
      type: "website",
      siteName: siteTitle,
      url: SITE_URL,
      title: siteTitle,
      description: tagline,
      ...(ogImg ? { images: [{ url: ogImg, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: tagline,
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
  const supportHref = settings?.supportUrl ?? DEFAULTS.supportHref;

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${dmSans.variable} antialiased`}
    >
      <body>
        <Header supportHref={supportHref} />
        <main>{children}</main>
        <Footer settings={settings} supportHref={supportHref} />
      </body>
    </html>
  );
}
