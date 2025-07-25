import React from 'react';
import { lazy } from 'react';
const Banner = lazy(()=>import('../components/Banner'));
const FeatureSection = lazy(()=>import('../components/FeatureSection'));
const TrendingProducts = lazy(()=>import('../components/TranddingProduct'));
const Testimonials =lazy(()=>import('../components/Testimonial'));
const Newsletter =lazy(()=>import('../components/Newsletter'));
const Advitagement =lazy(()=>import('../components/Advitasement'));

const Home = () => {
  return (
    <div className='w-full h-full'>
      <section className='w-full h-full'>
        <Banner></Banner>
      </section>
      <section className='w-full h-full'>
      {/* Featured Products Section */}
        <FeatureSection></FeatureSection>
      </section>
      <section className='w-full h-full'>
      {/* Featured Products Section */}
        <Advitagement></Advitagement>
      </section>
      <section className='w-full h-full'>
      {/* Trending Products Section */}
        <TrendingProducts></TrendingProducts>
      </section>
      <section className='w-full h-full'>
      {/* Trending Products Section */}
        <Testimonials></Testimonials>
      </section>
      <section className='w-full h-full'>
      {/* Trending Products Section */}
        <Newsletter></Newsletter>
      </section>
    </div>
  );
};

export default Home;