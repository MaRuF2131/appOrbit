import { useParams } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReviewCard from "../../components/ReviewCard";
import ReviewForm from "../../components/ReviewForm";
import ComponentLoader from '../../components/ComponentLoader'
import axiosInstance from "../../utils/axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const rightRef = useRef();
  const [rightHeight, setRightHeight] = useState(0);

  useEffect(()=>{
    document.title='Product details - AppOrbit'
  },[])
  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/private/single-product/${id}`);
      return res.data;
    },
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/private/reviews/${id}`);
      return res.data;
    },
  });

  // Upvote Mutation
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(`/api/private/product/upvot/${id}`, {
        email: user?.email,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product", id]);
      toast.success("You have upvotted this product.");
    },
    onError:(data)=>{
         toast.error(data.response.data.error); 
        console.log(data);
        
    }
  });

  // Report Mutation
 // Report Mutation
const reportMutation = useMutation({
  mutationFn: async () => {
    const res = await axiosInstance.post(`/api/private/product/${id}/report`, {
      email: user?.email,
    });
    return res.data;
  },
  onSuccess: () => {
    toast.success("You have reported this product.");
  },
  onError: (data) => {
    toast.error(data.response.data.error);
    console.log(data);
  },
});

// Submit Review
const reviewMutation = useMutation({
  mutationFn: async (data) => {
    const res = await axiosInstance.post("/api/private/review", {
      productId: id,
      reviewerName: user?.displayName,
      reviewerImage: user?.photoURL,
      reviewText: data.description,
      rating: parseInt(data.rating),
    });
    return res.data;
  },
  onSuccess: () => {
    toast.success("Review submitted.");
    queryClient.invalidateQueries(["reviews", id]);
  },
  onError: (error) => {
    toast.error("Failed to post review");
  },
});

  useEffect(() => {
    if (rightRef.current) {
      setRightHeight(rightRef.current.offsetHeight);
    }
  }, [product]);


  if (isLoading) return <ComponentLoader></ComponentLoader>;

  const isOwner = user?.email === product?.owner_mail;

  return (
    <div className="max-w-6xl mx-auto md:px-4 px-2 md:py-10 py-2">
      {/* Product Detail Card */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg md:p-6 p-2 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center ">
          <img
            src={product.product_image}
            alt={product.product_name}
            style={{ maxHeight: rightHeight }}
            className="w-full   h-full rounded-lg shadow"
          />
          <div className="right" ref={rightRef}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {product.product_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {product.product_description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-lime-100 dark:bg-lime-900 text-lime-600 dark:text-lime-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <a
              href={product.product_links}
              target="_blank"
              className="block mt-4 text-blue-500 underline"
            >
              Visit Product
            </a>

            {/* Owner Info */}
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Owner:</strong> {product.owner}</p>
              <p><strong>Email:</strong> {product.owner_mail}</p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => !isOwner && upvoteMutation.mutate()}
                disabled={isOwner}
                className={`px-4 py-2 rounded text-white ${
                  isOwner
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Upvote ({product.upvot.length})
              </button>
              <button
                onClick={() => !isOwner && reportMutation.mutate()}
                disabled={isOwner}
                className={`px-4 py-2 rounded text-white ${
                  isOwner
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Reviews
        </h3>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>

      {/* Post Review Section */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg md:p-6 p-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Post Your Review
        </h3>
        {isOwner ? (
          <p className="text-red-500">You cannot review , vote , report  your own product.</p>
        ) :(
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
          >
            {showForm ? "Hide Review Form" : "Post Your Review"}
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showForm ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pt-4">
              <ReviewForm
                onClose={()=>setShowForm(null)}
                onSubmitReview={reviewMutation}
              />
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
