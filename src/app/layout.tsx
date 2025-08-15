import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import { AuthProvider } from "@/lib/config/context/AuthContext";
import { Toaster } from "react-hot-toast";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Internyl | Find your perfect internship",
  description: "Internyl is your go-to platform for discovering and managing internships tailored to your career goals. | Streamline your search. Secure your future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.className}>
      <head>
        <meta name="ahrefs-site-verification" content="1bf3eb3cb396b00c795c6feed22093d00dd29b7ce6729827e98eb9f424faf17f" />
        <script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="ZGhqb0L0Wu3sMwp1GgSe/Q" 
          async
        ></script>
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar/>
          <Toaster position="top-center" />
          
          {/* Main content area with proper spacing for fixed navbar */}
          <main className="flex-grow pt-16 sm:pt-20">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}