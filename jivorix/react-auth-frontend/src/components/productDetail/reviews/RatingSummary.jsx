import { Star } from 'lucide-react';

const RatingSummary = () => {

  const rating = 4.2;
  const percentage = (rating / 5) * 100;

  return (
    <div className="flex items-center h-full gap-4 p-0 rounded-lg shadow-sm w-fit text-[#B59B7F]">
      {/* Circular Rating */}
      <div className="relative w-14 h-14">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-[#D4C4AC]"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-[#B6742F]"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#B59B7F]">
          {rating}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-1">
        <div className="flex items-center space-x-1 text-[#B6742F]">
          {[...Array(3)].map((_, i) => (
            <Star key={i} size={14} fill="#B6742F" stroke="#B6742F" />
          ))}
        </div>
        <p className="font-semibold text-[#6A5641]">95% of buyers are satisfied</p>
        <div className="text-sm text-[#C2B8AB] flex gap-2 mt-1">
          <span>98 Rating</span>
          <span>•</span>
          <span>125 Reviews</span>
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
