import { useForm } from "react-hook-form";
import { useCoupons } from "../hooks/useCoupon";
import { FaTimesCircle, FaTimes } from "react-icons/fa";
import TextOrCardLoading from '../components/TextOrcardLoader'
import {
  DateValidationCheck,
  NumberValidationCheck,
  StringValidationCheck,
} from "../utils/custom-validation/CustomValidation";
import { useEffect, useState } from "react";

const CouponUpdate = ({ coupon, onClose }) => {
 const [loading ,setloading]=useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    shouldUnregister: true,
    mode: "onChange",
  });

  const { updateCoupon } = useCoupons();

  const handleUpdateCoupon = async (data) => {
    await updateCoupon.mutateAsync({ id: coupon._id, updatedData: data });
    reset();
    setTimeout(() => onClose(), 500);
  };

  // ✅ Set default values when coupon prop changes
  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code || "",
        expiryDate: coupon.expiryDate?.split("T")[0] || "", // Format if ISO
        description: coupon.description || "",
        discount: coupon.discount || "",
      });
      setTimeout(() => {
         setloading(false);
      },500);
    }
  }, [coupon, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleUpdateCoupon)}
      className="fixed left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-blue-700 dark:border-blue-600 z-50"
    >

    {loading && <TextOrCardLoading></TextOrCardLoading>}
      {/* ✅ Close Button */}
    { !loading && <> 
    <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        aria-label="Close"
      >
        <FaTimes />
      </button>

      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
        🎁 Update Coupon
      </h2>

      <div className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Coupon Code
          </label>
          <input
            {...register("code", {
              required: "code is required",
              ...StringValidationCheck,
            })}
            placeholder="Enter coupon code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.code && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <FaTimesCircle /> {errors.code.message}
            </p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date
          </label>
          <input
            {...register("expiryDate", {
              required: "expiryDate is required",
              ...DateValidationCheck,
            })}
            type="date"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.expiryDate && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <FaTimesCircle /> {errors.expiryDate.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            {...register("description", {
              required: "Description is required",
              ...StringValidationCheck,
            })}
            placeholder="Short description"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <FaTimesCircle /> {errors.description.message}
            </p>
          )}
        </div>

        {/* Discount Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Discount Amount (%)
          </label>
          <input
            {...register("discount", {
              required: "Discount is required",
              ...NumberValidationCheck,
            })}
            type="number"
            placeholder="Enter discount amount"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.discount && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <FaTimesCircle /> {errors.discount.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg shadow transition duration-200"
        >
          Update Coupon
        </button>
      </div>
       </>}
    </form>
  );
};

export default CouponUpdate;
