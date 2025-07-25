import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios"; // Axios with auth
import ComponentLoader from '../../components/ComponentLoader'

const fetchReportedProducts = async () => {
  const res = await axiosInstance.get("/moderator/report/products");
  return res.data;
};

const deleteProductAndReport = async ({ productId, reportId }) => {
  await axiosInstance.delete(`/moderator/delete-product-and-report/${productId}/${reportId}`);
};

const ReportedProducts = () => {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reported-products"],
    queryFn: fetchReportedProducts,
  });

  const mutation = useMutation({
    mutationFn: deleteProductAndReport,
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-products"]);
      Swal.fire("Deleted!", "Product & report removed.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete.", "error");
    },
  });

  const handleDelete = ({ productId, reportId }) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ productId, reportId });
      }
    });
  };

  

  return (
    <section className="p-2 md:p-6 ">
      <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-gray-200">🛑 Reported Products</h2>

      {isLoading ? (
        <ComponentLoader>
        </ComponentLoader>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-500">No reported products found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left text-black dark:text-white">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {reports.map(({ _id, product }) => (
                <tr key={_id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4">
                    <img src={product?.product_image} alt={product?.product_name} className="w-14 h-14 rounded" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-200">{product?.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-200">
                    {product?.owner_mail}
                  </td>
                  <td className="px-6 py-4 flex gap-3 justify-center">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete({ productId: product._id, reportId: _id })
                      }
                      className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ReportedProducts;
