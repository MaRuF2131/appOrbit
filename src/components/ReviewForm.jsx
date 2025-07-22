import { useForm } from "react-hook-form";
import { useContext } from "react";
import useAuth from "../hooks/UseAuth";
import Swal from "sweetalert2";
import { StringValidationCheck } from "../utils/custom-validation/CustomValidation";

const ReviewForm = ({onClose, onSubmitReview  }) => {
  const { user } = useAuth();
   const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    shouldUnregister: true,
    mode: 'onChange',
});

  const onSubmit =async (data) => {
    const reviewData = {
      ...data,
      reviewerName: user?.displayName,
      reviewerImage: user?.photoURL,
      reviewerEmail: user?.email,
    };
     await onSubmitReview.mutateAsync(reviewData);
     reset();
     setTimeout(onClose, 500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 md:p-8 max-w-2xl mx-auto border dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Leave a Review</h2>
      
      {/* Reviewer Info */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user?.photoURL}
          alt="Reviewer"
          className="w-14 h-14 rounded-full border dark:border-gray-600"
        />
        <div className="max-w-full overflow-hidden">
          <p className="text-gray-700 dark:text-gray-300 font-medium">{user?.displayName}</p>
          <p className="text-gray-500  dark:text-gray-400 text-sm break-words whitespace-normal">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden Inputs */}
        <input type="hidden" value={user?.displayName} {...register("reviewerName")} />
        <input type="hidden" value={user?.photoURL} {...register("reviewerImage")} />
        <input type="hidden" value={user?.email} {...register("reviewerEmail")} />

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
            Review Description
          </label>
          <textarea
            {...register("description", { 
                required: 'Review is required.',
                ...StringValidationCheck

             })}
            className="w-full px-4 py-3 rounded-md border dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 outline-none"
            rows={4}
            placeholder="Write your honest feedback..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
            Rating (1 to 5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            {...register("rating", {
              required: true,
              min: 1,
              max: 5,
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 outline-none"
            placeholder="Enter rating between 1 and 5"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">Rating must be 1 to 5.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow-sm"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;