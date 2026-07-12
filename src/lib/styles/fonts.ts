import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Space-separated CSS variable class names for Geist Sans + Geist Mono.
 * Apply to `<body>` to make the font variables available throughout the tree.
 */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;
