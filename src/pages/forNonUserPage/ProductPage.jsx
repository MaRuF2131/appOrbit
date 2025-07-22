import { useState } from 'react';
import { useSearchProducts } from '../../hooks/useSearch';
import ProductCard from '../../components/ProductCard';
import ComponentLoader from '../../components/ComponentLoader';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSearchProducts(search, page);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="px-4 py-8 max-w-7xl w-full mx-auto">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex justify-center items-center flex-wrap gap-2"
      >
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by tags (e.g. ai, tools, productivity)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full shadow-sm  pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 dark:text-lime-400 pointer-events-none"
          />
        </div>
      </form>

      {/* Loading Spinner */}
      {isLoading ? (
        <ComponentLoader />
      ) : (
        <>
          {/* Product Grid */}
          {data?.products?.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex justify-center flex-wrap gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-md border ${
                      page === i + 1
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } transition`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            // Not Found Message
            <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
              <h2 className="text-xl font-semibold">No products found</h2>
              <p className="mt-2">Try different or more specific tags.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
