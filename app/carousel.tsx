"use client"
import React, { useEffect, useMemo, useState } from "react";

export interface CarouselProps {
    slides: CarouselSlide[]
}

export interface CarouselSlide {
    img: string,
    altText: string
}

export function Carousel(props: CarouselProps): React.ReactElement {
    const { slides } = props;
    const maxSlidesToShow = useMemo(() => slides.length, [slides]);
    // currentIndex tracks which "slot" we’re on
    const [currentIndex, setCurrentIndex] = useState(0);

    // slidesToShow tracks how many slides are visible at once
    const [slidesToShow, setSlidesToShow] = useState(1);
    // 1. useEffect to handle window resize and update slidesToShow
    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            //todo: is there a better way to align this with tailwind screen sizes?
            if (width >= 1280) { //tailwind xl or larger
                setSlidesToShow(Math.min(3, maxSlidesToShow));  // Show 3 slides on xLarge screens, don't set this higher than max
            } else if (width >= 1024) { //tailwind lg
                setSlidesToShow(Math.min(2, maxSlidesToShow));  // Show 2 slides on large screens
            } else { //tailwind md & sm
                setSlidesToShow(Math.min(1, maxSlidesToShow));  // Show 1 slide on small/med screens
            }
        }

        // Call once to set initial slidesToShow on mount
        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [maxSlidesToShow]);

    const maxIndex = React.useMemo(() => Math.max(1, slides.length + 1 - slidesToShow), [slides.length, slidesToShow]);
    // 2. Handlers for Prev/Next
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            //mod maxIndex gets wrap around behavior
            return (prevIndex - 1 + slides.length) % maxIndex;
        });
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            //mod maxIndex gets wrap around behavior
            return (prevIndex + 1) % maxIndex;
        });
    };

    //slides are squares rn so height = width
    const slideWidth = 350;
    // 3. Calculate translation for the carousel
    // Since we show multiple slides, we move by (100 / slidesToShow)% per "slot"
    const translateX = `translateX(-${currentIndex * (100 / slidesToShow)}%)`;

    return (
        <div className="relative overflow-hidden mx-auto h-350" style={{ width: `${slideWidth * slidesToShow}px` }}>
            {/* Carousel Container */}
            <div
                className="flex transition-transform duration-300 gap-0 w-full"
                style={{
                    transform: translateX
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        // This ensures each slide container is 1/slidesToShow of total width
                        style={{ flexBasis: `${100 / slidesToShow}%` }}
                        className="h-350 flex-shrink-0 p-0"
                    >
                        <img
                            src={slide.img}
                            alt={slide.altText}
                            className="h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 h-full rounded opacity-30 hover:opacity-50 hover:text-NaplesYellow">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={handlePrev} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 h-full rounded opacity-30 hover:opacity-50 hover:text-NaplesYellow right-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    );
}
