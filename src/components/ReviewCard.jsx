const ReviewCard = ({ review }) => {
  return (
    <div className="border dark:border-gray-600 p-4 rounded shadow">
      <div className="flex items-center gap-3 mb-2">
        <img src={review.reviewerImage} className="w-10 h-10 rounded-full" />
        <span className="font-medium">{review.reviewerName}</span>
      </div>
      <p className="text-sm text-gray-800 dark:text-gray-200">{review.reviewText}</p>
      <p className="text-yellow-500 mt-2">⭐ {review.rating} / 5</p>
    </div>
  );
};

export default ReviewCard;
