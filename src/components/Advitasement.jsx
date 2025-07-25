import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import ComponentLoader from '../components/ComponentLoader';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import { FaPercent, FaClock } from 'react-icons/fa6';

export const useCoupons = () => {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['Validcoupons'],
    queryFn: async () => {
      const res = await axiosInstance.get('/coupons/valid');
      return res.data;
    },
  });

  return { coupons, isLoading };
};

const CouponSlider = () => {
  const { coupons = [], isLoading } = useCoupons();

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        💸 Grab Exclusive Membership Coupons
      </h2>

      {isLoading && <ComponentLoader />}

      {!isLoading && coupons.length > 0 && (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          onSwiper={(swiper) => {
            const swiperEl = swiper.el;
            swiperEl.addEventListener('mouseenter', () => swiper.autoplay.stop());
            swiperEl.addEventListener('mouseleave', () => swiper.autoplay.start());
          }}
        >
          {coupons.map((coupon) => (
            <SwiperSlide key={coupon._id}>
              <div className="relative bg-gradient-to-br from-[#e0f7fa] to-[#f1f8e9] dark:from-[#2c3026] dark:to-[#6b7576] p-6 rounded-2xl shadow-xl transition transform hover:scale-[1.03] duration-300">
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  LIMITED TIME
                </div>

                <h3 className="text-xl font-bold text-cyan-800 dark:text-cyan-400 mb-2">
                  {coupon.title || "Special Offer"}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                  {coupon.description}
                </p>

                <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-semibold">
                  <FaPercent />
                  <span>{coupon.discount}% Discount</span>
                </div>

                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <FaClock />
                  <span>
                    Expires on:{" "}
                    {new Date(coupon.expiryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="mt-5 border-t pt-4 text-start">
                  <span className="inline-block bg-cyan-600 text-white text-sm px-4 py-1 rounded-md font-mono tracking-wide shadow-md">
                    USE CODE: {coupon.code}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default CouponSlider;
