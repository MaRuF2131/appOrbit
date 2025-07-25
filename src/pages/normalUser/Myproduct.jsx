import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import useAuth from '../../hooks/UseAuth';
import Swal from 'sweetalert2';
import ComponentLoader from '../../components/ComponentLoader';

const Myproduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myProducts'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/private/myproducts/${user?.email}`);
      console.log(user?.email)
      return data;
    },
    select: (data) =>
      data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.email,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await axiosInstance.delete(`/api/private/delete-product/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts']);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your product has been deleted.',
        icon: 'success',
        confirmButtonColor: '#22c55e'
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the product.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  });

  if (isLoading || !user?.email) return <ComponentLoader></ComponentLoader>;
  if (isError) return <div className='text-red-700 text-xl font-semibold'>Error loading products.</div>;

  return (
    <div className="my-products dark:text-white text-black">
      <h2 className="text-2xl text-center font-bold mb-4">My Products</h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border text-sm md:text-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-black">
              <th className="p-2 border text-left">Product Name</th>
              <th className="p-2 border text-center">Votes</th>
              <th className="p-2 border text-center">Status</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data?.length && (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  You have no products yet.
                </td>
              </tr>
            )}
            {data?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-200 dark:hover:bg-black">
                <td className="p-2 border">{product.product_name}</td>
                <td className="p-2 border text-center">{product.upvot.length || 0}</td>
                <td className="p-2 border text-center">{product.status || 'Pending'}</td>
                <td className="p-2 border text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => navigate(`/dashboard/products/update/${product._id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: `You want to delete "${product.product_name}"?`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Yes, delete it!',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(product._id);
                          }
                        });
                      }}
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Myproduct;
