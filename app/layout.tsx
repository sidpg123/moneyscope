import Navbar from "@/components/NavBar";
import RecoilContextProvider from "@/lib/recoilContextProvider";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const sansFont = Source_Sans_3({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-sans",
});


export const metadata: Metadata = {
  title: "MoneyScope",
  description: "Track your money!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sansFont.className} tracking-wide antialiased`}
      >
        <RecoilContextProvider>
          <Navbar />
          {children}
          <Toaster richColors />
        </RecoilContextProvider>
      </body>
    </html>
  );
}
