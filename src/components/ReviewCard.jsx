import { FaClock } from 'react-icons/fa';
const ReviewCard = ({ review }) => {
  return (
    <div className="border dark:border-gray-600 p-4 rounded shadow relative">
      <div className="flex items-center gap-3 mb-2">
        <img src={review.reviewerImage} className="w-10 h-10 rounded-full" />
        <span className="dark:text-gray-100 text-black font-medium">{review.reviewerName}</span>
      </div>
      <p className="text-sm text-gray-800 dark:text-gray-200">{review.reviewText}</p>
      <p className="text-yellow-500 mt-2">⭐ {review.rating} / 5</p>
      <p className="text-blue-500 mt-2 mr-2 absolute right-0 top-0 flex items-center gap-1 text-sm">
            <FaClock />
            {new Date(review.createdAt).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
        </p>

    </div>
  );
};

export default ReviewCard;
