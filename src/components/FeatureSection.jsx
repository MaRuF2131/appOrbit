import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowUp } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import axiosInstance from '../utils/axios';
import useAuth from '../hooks/UseAuth';
import ComponentLoader from '../components/ComponentLoader'
import toast from 'react-hot-toast';

const fetchFeaturedProducts = async () => {
  const res = await axiosInstance.get('/products/featured');
  return res.data;
};

const FeaturedProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: 1000,
  });

  const upvoteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch(`/api/private/product/upvot/${id}`, {
        email: user?.email,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['featuredProducts']);
      queryClient.invalidateQueries(['trendingProducts']);
      toast.success("You have upvoted this product.");
    },
    onError: (data) => {
      toast.error(data.response.data.error);
      console.log(data);
    }
  });

  const handleUpvote = (product) => {
    if (!user) return navigate('/login');
    if (product.owner_mail === user.email || product.upvot?.includes(user.email)) {
      toast.error("Owner can't leave vote");
      return;
    }

    upvoteMutation.mutate(product._id);
  };

  if (isLoading) return <ComponentLoader />;
  if (isError) return <p className="text-center text-red-500">Failed to load featured products</p>;

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-black dark:text-gray-200 mb-6 text-center">🔥 Featured Products</h2>
      
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product._id} className="h-full">
            <div className="bg-white dark:bg-gray-900  flex flex-col items-start justify-between rounded-xl shadow p-4 hover:shadow-lg transition h-full">
              <img src={product?.product_image} alt={product?.product_name} className="w-full h-40 object-cover rounded-md mb-3" />
              <Link
                to={`/product/${product?._id}`}
                className="text-xl font-semibold text-cyan-600 hover:underline block"
              >
                {product?.product_name}
              </Link>
              <div className="my-2 overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                {product?.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded mr-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                disabled={
                  !user || product?.owner_mail === user?.email || product?.upvot?.includes(user.email)
                }
                onClick={() => handleUpvote(product)}
                className={`mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-md w-full text-white transition ${
                  !user || product.owner_mail === user.email || product.upvot?.includes(user.email)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600'
                }`}
              >
                <FaArrowUp /> {product?.upvot.length || 0} Upvotes
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedProducts;
