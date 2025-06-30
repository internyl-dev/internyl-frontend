import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

import Navbar from "@/lib/components/Navbar";
import { AuthProvider } from "@/lib/config/context/AuthContext";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Internyl",
  description: "Streamline your search. Secure your future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.className}>
      <body>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
