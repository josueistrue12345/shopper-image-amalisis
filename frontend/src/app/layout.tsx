import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const msRounded = localFont({
  src: "../fonts/material-symbols/Rounded-Regular.woff2",
  variable: "--font-ms-rounded",
  display: "swap",
});

const msfRounded = localFont({
  src: "../fonts/material-symbols/Rounded_Filled-Regular.woff2",
  variable: "--font-msf-rounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mobo Analyzer",
  description: "Análisis de Imágenes con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${msRounded.variable} ${msfRounded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
