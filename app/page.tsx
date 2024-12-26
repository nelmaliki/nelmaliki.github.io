import React from "react";
import { Carousel, CarouselSlide } from "./carousel";

const carouselSlides: CarouselSlide[] = [{
  img: "/carousel/carouselPlaceholder.png",
  altText: "test-1"
},
{
  img: "/carousel/carouselPlaceholder.png",
  altText: "test-2"
},
{
  img: "/carousel/carouselPlaceholder.png",
  altText: "test-3"
},
{
  img: "/carousel/carouselPlaceholder.png",
  altText: "test-4"
}];

export default function Home() {
  return (
    <div className="items-center justify-items-center p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 justify-around">
        <LandingPageDisplay />
        <Carousel slides={carouselSlides} />
      </main>
    </div>
  );
}

function LandingPageDisplay(): React.ReactElement {
  return <div className="text-amber-50 text-4xl">
    <span >
      Hi, I&#39;m
    </span>
    &nbsp;
    <strong className="text-[#F2CD60]">
      Nour Schumaliki.
    </strong>
    <br />
    <span>
      Currently engineering solutions at
    </span>
    &nbsp;
    <strong className="text-[#F2CD60] py-40">
      Ab Initio.
    </strong>
    <br/>
    <p className="text-3xl">
      This site was built by me to show off my side projects as I experiment with different technologies.
    </p>
  </div>
}
