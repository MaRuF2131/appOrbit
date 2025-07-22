import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import TextOrCardLoading from "../components/TextOrcardLoader";

const ProductView = ({ product, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setTimeout(() => setLoading(false), 400);
    }
  }, [product]);

  return (
    <div className="fixed left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-[95%] max-h-[95%] lg:max-w-[1200px] h-fit hide-scrollbar overflow-auto mx-auto border border-blue-700 dark:border-blue-600 z-[999]">
      {loading ? (
        <TextOrCardLoading />
      ) : (
        <>
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
            🚀 Product Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden border ">
              <img
                src={product.product_image}
                alt={product.product_name}
                className="w-full  lg:min-w-60  h-full"
              />
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <span className="block font-medium text-gray-700 dark:text-gray-300">
                  Name:
                </span>
                <p className="text-lg font-bold text-blue-600">
                  {product.product_name}
                </p>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-2">
                <img
                  src={product.owner_profile}
                  alt={product.owner}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{product.owner}</p>
                  <p className="text-xs text-gray-500">{product.owner_mail}</p>
                </div>
              </div>

              {/* Product Link */}
              <div>
                <span className="block font-medium text-gray-700 dark:text-gray-300">
                  Link:
                </span>
                <a
                  href={product.product_links}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {product.product_links}
                </a>
              </div>

              {/* Description */}
              <div>
                <span className="block font-medium text-gray-700 dark:text-gray-300">
                  Description:
                </span>
                <p className="text-gray-800 dark:text-gray-200">
                  {product.product_description || "No description provided."}
                </p>
              </div>

              {/* Tags */}
              <div>
                <span className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status, Featured, Created At */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                <p>Status: <span className="font-medium text-yellow-600">{product.status}</span></p>
                <p>Featured: {product.isfeatured ? "Yes ⭐" : "No"}</p>
                <p>Upvotes: {product.upvot || 0}</p>
                <p>Created At: {new Date(product.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductView;
