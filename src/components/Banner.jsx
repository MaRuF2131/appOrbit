import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    title: 'Discover the Next Big Thing in Tech',
    subtitle: 'Explore innovative products, tools, and startups launched by makers around the world.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80',
    title: 'Launch Your Product on AppOrbit',
    subtitle: 'Get visibility, feedback, and your first users by sharing your creation with the community.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    title: 'Curated Daily for Innovators',
    subtitle: 'Stay in the loop with handpicked tech tools, apps, and platforms featured every day.',
  },
];

const Banner = () => {
  return (
    <div className="w-full h-[75vh]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full z-10"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className=' w-full h-[75vh] z-20 bg-black'>
            <div
              className=" w-full h-full z-20  flex items-center justify-center "
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize:'cover',
                backgroundPosition:'center',
                backgroundRepeat:'no-repeat',
              }}
            >
              {/* Overlay */}

              {/* Text */}
             <div className="z-50  w-full h-full bg-black/30 flex flex-col items-center justify-center text-center  px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black text-shadow-md text-shadow-white">{slide.title}</h2>
                <p className="text-lg md:text-xl text-white text-shadow-md text-shadow-black">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
