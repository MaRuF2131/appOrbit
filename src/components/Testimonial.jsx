import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const testimonials = [
  {
    name: 'John Doe',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    comment: 'Amazing product! It improved my workflow drastically.',
  },
  {
    name: 'Jane Smith',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    comment: 'The team is very responsive and the UI is clean.',
  },
  {
    name: 'Ali Khan',
    photo: 'https://randomuser.me/api/portraits/men/65.jpg',
    comment: 'Highly recommended for anyone looking for quality.',
  },
];

const Testimonials = () => {
  const swiperRef = useRef(null);

  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl dark:text-gray-200 text-black font-bold text-center mb-8">
        What Our Users Say
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
        }}
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
        onMouseLeave={() => swiperRef.current?.autoplay?.start()}
      >
        {testimonials.map(({ name, photo, comment }, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow text-center h-full flex flex-col items-center justify-center">
              <img
                src={photo}
                alt={name}
                className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
              />
              <p className="text-gray-700 dark:text-gray-300 italic mb-2">"{comment}"</p>
              <h3 className="font-semibold text-lg text-cyan-600">{name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
