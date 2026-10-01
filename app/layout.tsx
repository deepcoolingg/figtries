import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://figtries.com"),
  title: "Figtries | We Architect Reliable Digital Systems",
  description: "At Figtries, we combine data, infrastructure, and design to support systems that remain reliable as organizations grow.",
  keywords: ["Figtries", "Software House", "Tech Company", "Data Intelligence", "AI & Machine Learning", "System Architecture", "Jakarta, Indonesia"],
  openGraph: {
    title: "Figtries | We Architect Reliable Digital Systems",
    description: "We Architect Reliable Digital Systems.",
    url: "https://figtries.com",
    siteName: "Figtries",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${garamond.variable}`}
    >
      <body className="min-h-full flex flex-col font-serif bg-background text-foreground selection:bg-kota-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}