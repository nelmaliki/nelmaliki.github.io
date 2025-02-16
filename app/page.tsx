import React from "react";
import { CarouselSlide } from "./carousel";

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
      </main>
    </div>
  );
  //<Carousel slides={carouselSlides} />
}

function LandingPageDisplay(): React.ReactElement {
  return <div className="text-amber-50 text-4xl">
    <span >
      Hi, I&#39;m
    </span>
    &nbsp;
    <strong className="text-TiffanyBlue">
      Nour Schumaliki.
    </strong>
    <br />
    <span className="text-3xl">
      Currently engineering solutions at
    </span>
    &nbsp;
    <strong className="text-TiffanyBlue text-3xl">
      Ab Initio.
    </strong>
    <br />
    <p className="text-3xl">
      This site was built by me to show off my side projects as I experiment with different technologies.
    </p>
  </div>
}
