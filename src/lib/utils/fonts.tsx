import { Inter, Caveat, Kalam } from "next/font/google";

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ['600', '700'],
  variable: "--font-caveat",
});

export const kalam = Kalam({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-kalam",
});