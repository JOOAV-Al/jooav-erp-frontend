import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import AppProviders from "@/lib/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const garantpro = localFont({
  variable: "--font-garantpro",
  src: [
    {
      path: "./fonts/Garant-Pro-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Thin-Italic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Extra-Light.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Extra-Light-Italic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Light-Italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Medium-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Semi-Bold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Semi-Bold-Italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Bold-Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Extra-Bold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Extra-Bold-Italic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/Garant-Pro-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Garant-Pro-Black-Italic.otf",
      weight: "900",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "JOOAV",
  description: "Redefining Retail Inventory and Logistics in Africa",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${garantpro.variable} antialiased bg-background dark:bg-black font-garantpro`}
      >
        <AppProviders>
          <div>{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
