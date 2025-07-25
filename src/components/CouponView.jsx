import { FaTimes } from "react-icons/fa";
import TextOrCardLoading from "../components/TextOrcardLoader";
import { useEffect, useState } from "react";

const CouponView = ({ coupon, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coupon) {
      setTimeout(() => setLoading(false), 400);
    }
  }, [coupon]);

  return (
    <div className="fixed left-[50%] top-[50%] overflow-auto max-h-screen transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 md:p-8 p-2 rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-blue-700 dark:border-blue-600 z-[1000]">
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
            🔍 View Coupon Details
          </h2>

          <div className="space-y-6 text-sm">
            {/* Coupon Code */}
            <div>
              <span className="block font-medium text-gray-700 dark:text-gray-300">
                Coupon Code:
              </span>
              <p className="text-lg font-mono text-lime-600">{coupon.code}</p>
              <p className="text-xs text-gray-500 mt-1">
                🔐 Use this code at checkout to get a discount.
              </p>
            </div>

            {/* Expiry Date */}
            <div>
              <span className="block font-medium text-gray-700 dark:text-gray-300">
                Expiry Date:
              </span>
              <p className="text-gray-800 dark:text-gray-100">
                {coupon.expiryDate?.split("T")[0]}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ⏳ This coupon is valid until this date. After that, it will no longer be accepted.
              </p>
            </div>

            {/* Discount */}
            <div>
              <span className="block font-medium text-gray-700 dark:text-gray-300">
                Discount:
              </span>
              <p className="text-gray-800 dark:text-gray-100">{coupon.discount}% OFF</p>
              <p className="text-xs text-gray-500 mt-1">
                🎁 The discount will be applied to the total amount during purchase.
              </p>
            </div>

            {/* Description */}
            <div>
              <span className="block font-medium text-gray-700 dark:text-gray-300">
                Description:
              </span>
              <p className="text-gray-800 dark:text-gray-100">{coupon.description}</p>
              {coupon.description?.length < 3 && (
                <p className="text-xs text-yellow-500 mt-1">
                  ✏️ No description provided for this coupon.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CouponView;
