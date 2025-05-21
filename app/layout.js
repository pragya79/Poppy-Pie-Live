// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import { Reenie_Beanie } from "next/font/google";
import "./globals.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import AuthWrapper from "./components/context/AuthWrapper"; // 👈 new import

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const reenieBeanie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-reenie-beanie",
  display: "swap",
});

export const metadata = {
  title: "Poppy-Pie | Marketing & Brand Management",
  description:
    "Professional marketing, branding, and growth management services to help your business thrive in today's competitive landscape.",
  keywords: "marketing, branding, growth management, AI marketing",
  openGraph: {
    title: "Poppy-Pie | Marketing & Brand Management",
    description: "Professional marketing and branding services",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${reenieBeanie.variable} antialiased`}>
        <AuthWrapper>
          <Header />
          {children}
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
