import React, { useState, useEffect, useCallback } from 'react';

// --- Inline Icon Components (Replacing external imports) ---
const ChevronLeftIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);
// -----------------------------------------------------------

const mockSlides = [
    { 
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200&h=450", 
        title: "TOP MOTIVATIONAL BUSINESS COACH" 
    }, 
    { 
        url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200&h=450", 
        title: "Empower Your Career" 
    },
    { 
        url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200&h=450", 
        title: "Expert Leadership Training" 
    },
    { 
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200&h=450", 
        title: "Transform Your Business" 
    },
];

const ImageSlider = ({ slides = mockSlides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, slides.length]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, slides.length]);

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    // Auto-play interval
    useEffect(() => {
        const sliderInterval = setInterval(() => {
            goToNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(sliderInterval);
    }, [goToNext]);

    if (!slides || slides.length === 0) {
        return <div className="p-4 text-center text-gray-500">No slides provided.</div>;
    }

    return (
        // Outer container for full-width control
        <div className="w-full  ">
            {/* The main slider frame: Responsive height, overflow hidden */}
            <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] relative group overflow-hidden shadow-xl bg-gray-800">
                
                {/* Slides container - using a sliding effect */}
                <div 
                    className="w-full h-full flex transition-transform ease-in-out duration-700 " 
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, slideIndex) => (
                        <div 
                            key={slideIndex} 
                            // Ensures images fill space on all devices
                            className="w-full h-full shrink-0 bg-center bg-cover bg-no-repeat" 
                            style={{ backgroundImage: `url(${slide.url})` }}
                            aria-label={`Slide ${slide.title || 'banner'} ${slideIndex + 1}`}
                            role="img"
                        >
                            {/* Title overlay - Responsive font size and background opacity for legibility */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="text-center max-w-4xl px-4">
                                    <h2 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white select-none tracking-tight leading-tight drop-shadow-2xl">
                                        {slide.title}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Left Arrow (Responsive sizes) */}
                <button 
                    aria-label="Previous slide" 
                    onClick={goToPrevious} 
                    className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-5 text-xl sm:text-2xl rounded-full p-2 sm:p-3 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                    <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>

                {/* Right Arrow (Responsive sizes) */}
                <button 
                    aria-label="Next slide" 
                    onClick={goToNext} 
                    className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-5 text-xl sm:text-2xl rounded-full p-2 sm:p-3 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                    <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
            </div>

            {/* Dot indicators - POSITIONED OUTSIDE the main slider frame using mt-6 */}
            <div className="flex justify-center mt-6 space-x-2">
                {slides.map((slide, slideIndex) => (
                    <button
                        key={slideIndex}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                        onClick={() => goToSlide(slideIndex)}
                        className={`cursor-pointer h-3 w-3 rounded-full transition-all duration-300 shadow-md ${
                            currentIndex === slideIndex 
                                ? 'bg-indigo-600 scale-125' // Primary color for active dot
                                : 'bg-gray-300 hover:bg-indigo-400' // Subtle grey for inactive dots
                        }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
