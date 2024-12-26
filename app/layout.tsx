import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} toolbar`}>
        <NavBar />
        <main>
          <div className="bg-gradient-to-b from-[#bec4c8] to-[#34383b] min-h-screen text-amber-50">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
