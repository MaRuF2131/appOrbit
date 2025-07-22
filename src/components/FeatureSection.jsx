import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import useAuth from '../hooks/UseAuth';

const fetchFeaturedProducts = async () => {
/*   const res = await axios.get('/products/featured');
  return res.data; */
  return [];
};

const FeaturedProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch featured products
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

  // Handle upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async ({ productId, voter }) => {
      await axios.patch(`/products/upvote/${productId}`, { voter });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['featuredProducts']);
    },
  });

  const handleUpvote = (product) => {
    if (!user) {
      return navigate('/login');
    }

    if (
      product?.ownerEmail === user?.email ||
      product?.upvotedBy?.includes(user?.email)
    ) {
      return;
    }

    upvoteMutation.mutate({
      productId: product?._id,
      voter: user?.email,
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading featured products...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load featured products</p>;

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🔥 Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product?._id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 hover:shadow-lg transition">
            <img src={product?.image} alt={product?.name} className="w-full h-40 object-cover rounded-md mb-3" />
            <Link
              to={`/product/${product?._id}`}
              className="text-xl font-semibold text-cyan-600 hover:underline block"
            >
              {product?.name}
            </Link>
            <div className="flex flex-wrap gap-2 my-2">
              {product?.tags.map((tag, i) => (
                <span key={i} className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            <button
              disabled={
                !user || product?.ownerEmail === user?.email || product?.upvotedBy?.includes(user.email)
              }
              onClick={() => handleUpvote(product)}
              className={`mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-md w-full text-white transition ${
                !user || product.ownerEmail === user.email || product.upvotedBy?.includes(user.email)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              <FaArrowUp /> {product?.upvotes || 0} Upvotes
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
