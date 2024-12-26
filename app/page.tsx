import React from "react";
import { Carousel, CarouselSlide } from "./carousel";
import Image from "next/image";

const carouselSlides: CarouselSlide[] = [{
  img: "carousel/carouselPlaceholder.png",
  altText: "test-1"
},
{
  img: "carousel/carouselPlaceholder.png",
  altText: "test-1"
}];
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 sm:items-center">
        <div className="border-2 flex justify-stretch rounded-full p-4 space-x-2 border-[#34383B] text-lg">
          <span className="text-left text-black">Nour Schumaliki</span>
          <strong className="text-left text-black">·</strong>
          <span className="text-right text-black whitespace-pre-line" >{
            `Full-stack Software Engineer`
          }</span>
        </div>
        <Carousel slides={carouselSlides} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="icons/linkedinLogo.svg" alt="Icon" width={32} height={32} />
          LinkedIn (todo)
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="icons/githubLogo.svg" alt="Icon" width={32} height={32} />
          Github (todo)
        </a>
      </footer>
    </div>
  );
}
