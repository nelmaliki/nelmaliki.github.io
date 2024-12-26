import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "./navbar";
import Image from "next/image";

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
//#34383b
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} toolbar`}>
        <NavBar />
        <main className="bg-[#4b4e51] min-h-screen text-amber-50">
          {children}
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center flex-1 absolute bottom-3 w-full">
            <a
              className="flex items-center gap-2 hover:text-[#F2CD60]"
              href="https://www.linkedin.com/in/nour-elmaliki-527637195/"
              target="_blank"
              rel="noopener noreferrer external"
            >
              <Image src="/icons/linkedinLogo.svg" alt="Icon" width={32} height={32} />
              LinkedIn
            </a>
            <a
              className="flex items-center gap-2 hover:text-[#F2CD60]"
              href="https://github.com/nelmaliki"
              target="_blank"
              rel="noopener noreferrer external"
            >
              <Image src="/icons/githubLogo.svg" alt="Icon" width={32} height={32} />
              Github
            </a>
          </footer>
        </main>
      </body>
    </html>
  );
}
