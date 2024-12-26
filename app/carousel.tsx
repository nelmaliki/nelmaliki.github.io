"use client"
import React, { useEffect, useState } from "react";

export interface CarouselProps {
    slides: CarouselSlide[]
}

export interface CarouselSlide {
    img: string,
    altText: string
}

export function Carousel(props: CarouselProps): React.ReactElement {
    const { slides } = props;
  
    // currentIndex tracks which "slot" we’re on
    const [currentIndex, setCurrentIndex] = useState(0);
  
    // slidesToShow tracks how many slides are visible at once
    const [slidesToShow, setSlidesToShow] = useState(1);
  
    // 1. useEffect to handle window resize and update slidesToShow
    useEffect(() => {
      function handleResize() {
        const width = window.innerWidth;
  
        // Change these breakpoints as you see fit
        if (width >= 1024) {
          setSlidesToShow(3);  // Show 3 slides on large screens
        } else if (width >= 768) {
          setSlidesToShow(2);  // Show 2 slides on medium screens
        } else {
          setSlidesToShow(1);  // Show 1 slide on small screens
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
    }, []);
  
    // 2. Handlers for Prev/Next
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => {
        // Option A: "Wrap" around
        // If you want clamping, see notes below
        return (prevIndex - 1 + slides.length) % slides.length;
      });
    };
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % slides.length;
      });
    };
  
    // 3. Calculate translation for the carousel
    // Since we show multiple slides, we move by (100 / slidesToShow)% per "slot"
    const translateX = `translateX(-${currentIndex * (100 / slidesToShow)}%)`;
  
    return (
      <div className="relative w-full max-w-4xl overflow-hidden mx-auto">
        {/* Carousel Container */}
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: translateX,
            width: '100%',
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              // This ensures each slide container is 1/slidesToShow of total width
              style={{ flex: `0 0 ${100 / slidesToShow}%` }}
              className="max-h-[40vh] flex-shrink-0 p-2"
            >
              <img
                src={slide.img}
                alt={slide.altText}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
  
        {/* Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    );
  }
