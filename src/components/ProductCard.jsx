import { FaTags, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden dark:bg-gray-800">
      <img
        src={product.product_image}
        alt={product.product_name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {product.product_name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
          {product.product_description}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {product.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              <FaTags className="text-[10px]" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 text-right">
          <Link
            to={`/product/${product._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
          >
            View Details <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
