import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
    return (
        <div className="App p-8">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}

      >
        <div>
          <img src="/kb-1.png" alt="Slide 1" />
          
        </div>
        <div>
          <img src="/ban-2.png" alt="Slide 2" />
         
        </div>
        <div>
          <img src="https://via.placeholder.com/600x300?text=Slide+3" alt="Slide 3" />
       
        </div>
      </Carousel>
    </div>
    );
};

export default Banner;