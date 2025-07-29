import React from 'react';
import Banner from './Banner';
import ProductSection from './ProductSection';
import AdvertisementSection from './AdvertisementSection';
import CountUpSection from './CountUpSection';


const Home = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <ProductSection></ProductSection>
            <AdvertisementSection></AdvertisementSection>
            <CountUpSection></CountUpSection>
        </div>
    );
};

export default Home;