import { useForm } from "react-hook-form";
import { useCoupons } from "../hooks/useCoupon";
import {FaTimesCircle } from 'react-icons/fa';
import {
  DateValidationCheck,
  NumberValidationCheck,
  StringValidationCheck
} from '../utils/custom-validation/CustomValidation'


const CouponForm = ({ setShowForm }) => {
  const { register, handleSubmit, reset,formState:{errors} } = useForm(
    {
    criteriaMode: 'all',
    shouldUnregister: true,
    mode: 'onChange',
  }
  );
  const { addCoupon } = useCoupons();

 const handleAddCoupon = async(data) => {
    // You can call your mutation here instead of console
    console.log("New Coupon Submitted:", data);
    await addCoupon.mutateAsync(data);
    reset();
    // Close form smoothly
    setTimeout(() => setShowForm(false), 500);
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddCoupon)}
      className="bg-white dark:bg-gray-900 md:p-8 p-2 rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-blue-700 dark:border-blue-600"
    >
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
        🎁 Add New Coupon
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Coupon Code
          </label>
          <input
            {...register("code", { 
              required: 'code is required',
              ...StringValidationCheck 
            })}
            placeholder="Enter coupon code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
           {errors.code && (
            <p className="text-red-600 text-sm mt-1 flex  items-center gap-1">
              <FaTimesCircle /> {errors.code.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date
          </label>
          <input
            {...register("expiryDate", { 
              required: "expiryDate is required",
              ...DateValidationCheck
             })}
            type="date"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        {errors.expiryDate && (
            <p className="text-red-600 text-sm mt-1 flex  items-center gap-1">
              <FaTimesCircle /> {errors.expiryDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            {...register("description", { 
              required: "Description is required",
              ...StringValidationCheck
             }
            )}
            placeholder="Short description"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          {errors.description && (
              <p className="text-red-600 text-sm mt-1     flex  items-center gap-1">
              <FaTimesCircle /> {errors.description.message}
             </p>
           )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Discount Amount (%)
          </label>
          <input
            {...register("discount", { 
                required: "Discount is required",
                ...NumberValidationCheck
             })}
            type="number"
            placeholder="Enter discount amount"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.discount && (
            <p className="text-red-600 text-sm mt-1 flex  items-center gap-1">
              <FaTimesCircle /> {errors.discount.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg shadow transition duration-200"
        >
          Add Coupon
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
