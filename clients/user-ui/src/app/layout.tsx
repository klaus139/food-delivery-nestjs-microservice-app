import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers/NextUIProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets:['latin'],
  weight:['400','500','600','700'],
  variable:'--font-Poppins',
  

})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kd Logistics",
  description: "Best Food delivery app there is",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable}  ${geistMono.variable} text-white`}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
