import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
    return (
        <div className="w-full p-2 md:p-4">
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={5000}
                transitionTime={800}
                swipeable
                emulateTouch
            >
                <div>
                    <img
                        src="/ban-1.png"
                        alt="Slide 1"
                        className="w-full h-[200px] md:h-[300px] lg:h-[520px] object-cover rounded-xl"
                    />
                </div>
                <div>
                    <img
                        src="/ban-2.png"
                        alt="Slide 2"
                        className="w-full h-[200px] md:h-[300px] lg:h-[520px] object-cover rounded-xl"
                    />
                </div>
                <div>
                    <img
                        src="/ban-3.png"
                        alt="Slide 3"
                        className="w-full h-[200px] md:h-[300px] lg:h-[520px] object-cover rounded-xl"
                    />
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;
