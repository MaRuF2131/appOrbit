import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import ComponentLoader from '../../components/ComponentLoader';
import ProductView from '../../components/ViewProductOnModal';

const fetchProducts = async (search) => {
  const res = await axiosInstance.get(`/moderator/allproducts?name=${search}`);
  return res.data;
};


const ProductReviewQueue = () => {
  const [search, setSearch] = useState('');
  const[selectedProduct,setSelectedProduct]=useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

const view = (product) => {
  Swal.fire({
    title: 'What would you like to do?',
    text: 'Choose an action for this product.',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonColor: '#22c55e',   // Green - Open Choice Modal
    denyButtonColor: '#3b82f6',      // Blue - Go to Product Page
    cancelButtonColor: '#d33',       // Red - Cancel
    confirmButtonText: 'Open Choice Modal',
    denyButtonText: 'Go to Product Page',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      setSelectedProduct(product); // Open Choice Modal
    } else if (result.isDenied) {
      navigate(`/product/${product._id}`); // Go to product details page
    }
    // If canceled, do nothing
  });
};



  const { data: products = [], isLoading } = useQuery({
    queryKey: ['allProducts', search],
    queryFn: () => fetchProducts(search),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      await axiosInstance.patch(`/moderator/products/status/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['allProducts']);
      Swal.fire('Success!', 'Product status updated.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to update status.', 'error');
    },
  });

  const featureMutation = useMutation({
    mutationFn: async (id) =>
      await axiosInstance.patch(`/moderator/products/feature/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['allProducts']);
      Swal.fire('Success!', 'Product marked as featured.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to feature product.', 'error');
    },
  });

  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${status} this product?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, status });
      }
    });
  };

  const handleFeature = (id) => {
    Swal.fire({
      title: `Make Featured?`,
      text: `Do you want to show this product on the homepage?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, feature it!',
    }).then((result) => {
      if (result.isConfirmed) {
        featureMutation.mutate(id);
      }
    });
  };

  const sorted = [...products].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <div className="md:p-6 p-2 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-10 text-lime-600 dark:text-blue-400 tracking-wide">
        📦 Product Review Queue
      </h2>

      {/* Search bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search by product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-lime-400 shadow-sm focus:ring-2 focus:ring-lime-500 focus:outline-none text-gray-800 dark:text-white dark:bg-gray-900 transition duration-300"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 dark:text-lime-400 pointer-events-none"
          />
        </div>
      </div>

      {isLoading ? (
        <ComponentLoader />
      ) : sorted.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {sorted.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => view(product)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      disabled={product.isfeatured || product.status==='rejected'}
                      onClick={() => handleFeature(product._id)}
                      className={`px-3 py-1  rounded-md transition text-sm
                          ${
                          product.isfeatured || product.status==='rejected'
                          ? 'bg-purple-300 text-white cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`
                      }
                    >
                     { product.isfeatured?"Featured":"Make Featured"}
                    </button>
                    <button
                      onClick={() => handleStatusChange(product._id, 'accepted')}
                      disabled={product.status !== 'pending'}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        product.status !== 'pending'
                          ? 'bg-green-300 text-white cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                     { product.status === 'pending' || product.status === 'rejected'?"Accept":"Accepted"}
                    </button>
                    <button
                      onClick={() => handleStatusChange(product._id, 'rejected')}
                      disabled={product.status !== 'pending'}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        product.status !== 'pending'
                          ? 'bg-red-300 text-white cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      { product.status !== 'pending' && product.status !== 'accepted' && product.status === 'rejected'?"Rejected":"Reject"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       { selectedProduct && <ProductView product={selectedProduct} onClose={() => setSelectedProduct(null)} /> }
    </div>
  );
};

export default ProductReviewQueue;
