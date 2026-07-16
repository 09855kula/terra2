import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Terra",
  description: "Cannabis delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${redHatDisplay.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f3f3f3]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
