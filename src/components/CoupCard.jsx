

const CouponCard = ({ coupon, onDelete ,onEdit,onView }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-bold text-lime-600">{coupon.code}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {coupon.description}
      </p>
      <div className="flex justify-between mt-2 text-sm dark:text-amber-100 text-black">
        <span>Expires: {coupon.expiryDate}</span>
        <span>💸 {coupon.discount}%</span>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onDelete(coupon._id)}
          className="px-4 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
        >
          Delete
        </button>

        <button
          onClick={() => onEdit(coupon)} // should open modal
          className="px-4 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium"
        >
          Edit
        </button>

        <button
          onClick={() => onView( coupon)} // or view logic
          className="px-4 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm font-medium"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
