import { Star } from 'lucide-react'; // or use your own SVG

const RatingBar = ({ stars, count, total }) => {
  const percentage = (count / total) * 100;

  return (
    <div className="flex items-center gap-3">
      {/* Star + Number */}
      <div className="flex items-center gap-1 w-6 shrink-0">
        <Star size={14} fill="#B6742F" stroke="#B6742F" />
        <span className="text-[#B6742F] text-sm">{stars}</span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 h-2 bg-[#F2EAE2] rounded-full relative overflow-hidden">
        <div
          className="h-full bg-[#B59B7F] rounded-full"
          style={{ width: `${percentage}%` }}
        />
        {/* Optional center indicator */}
        {/* <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-pink-500" /> */}
      </div>

      {/* Count */}
      <div className="w-10 text-right text-[#B59B7F] text-sm font-medium">{count}</div>
    </div>
  );
};

export default RatingBar;
