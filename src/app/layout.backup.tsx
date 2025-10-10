import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Gate from "./components/gate"; // ⬅ lowercase path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Everleap",
  description: "Everleap public site",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="sand">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Gate>{children}</Gate>
      </body>
    </html>
  );
}
