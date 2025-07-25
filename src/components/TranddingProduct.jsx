import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowUp } from 'react-icons/fa';
import axiosInstance from '../utils/axios';
import useAuth from '../hooks/UseAuth';
import ComponentLoader from '../components/ComponentLoader'
import toast from 'react-hot-toast';

const fetchTrendingProducts = async () => {
  const res = await axiosInstance.get('/products/trending'); // should return top 6 products sorted by upvotes
    
  return res.data || [];
};

const TrendingProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: fetchTrendingProducts,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const upvoteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch(`/api/private/product/upvot/${id}`, {
        email: user?.email,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trendingProducts']);
      toast.success("You have upvotted this product.");
    },
   onError:(data)=>{
         toast.error(data.response.data.error); 
        console.log(data);
        
    }
  });

  const handleUpvote = (product) => {
    if (!user) return navigate('/login');
    if (product.owner_mail === user.email || product.upvot?.includes(user.email)){toast.error("Owner can't leave vote");return;}

     upvoteMutation.mutate( product._id);
  };

  if (isLoading) return <ComponentLoader></ComponentLoader>;
  if (isError) return <p className="text-center text-red-500">Failed to load trending products</p>;

  return (
    <section className="px-4 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl text-black dark:text-gray-200 font-bold text-center mb-6">📈 Trending Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-gray-100 dark:bg-gray-900 flex flex-col items-start justify-between rounded-xl shadow p-4 hover:shadow-lg transition">
            <img src={product.product_image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
            <Link to={`/product/${product._id}`} className="text-xl font-semibold text-cyan-600 hover:underline block">
              {product.product_name}
            </Link>
            <div className="flex flex-wrap gap-2 my-2">
              {product.tags.map((tag, i) => (
                <span key={i} className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded">#{tag}</span>
              ))}
            </div>
            <button
              disabled={!user || product.owner_mail === user.email || product.upvot?.includes(user.email)}
              onClick={() => handleUpvote(product)}
              className={`mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-md w-full text-white transition ${
                !user || product.owner_mail === user.email || product.upvot?.includes(user.email)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              <FaArrowUp /> {product.upvot.length || 0} Upvotes
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/products">
          <button className="bg-blue-700/70 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition">
            Show All Products
          </button>
        </Link>
      </div>
    </section>
  );
};

export default TrendingProducts;
