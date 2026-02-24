import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import StyledComponentsRegistry from "../lib/registry";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Serlo Arabic Math Prototype",
  description: "A hybrid Next.js prototype using Serlo Editor for Arabic Math",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>
        <StyledComponentsRegistry>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
