import { Star } from 'lucide-react';

type RatingStarsProps = {
  value: number;
  size?: number;
  className?: string;
};

function starFill(value: number, index: number): number {
  const position = value - index;
  if (position >= 1) return 100;
  if (position <= 0) return 0;
  return position * 100;
}

export default function RatingStars({
  value,
  size = 16,
  className = '',
}: RatingStarsProps) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      role="img"
      aria-label={`${value} / 5`}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className="relative"
          style={{ width: size, height: size }}
        >
          <Star
            size={size}
            className="absolute inset-0 text-[#d4dfd7]"
            fill="currentColor"
            strokeWidth={0}
          />
          <span
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${starFill(value, index)}%` }}
          >
            <Star
              size={size}
              className="text-amber-400"
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
        </span>
      ))}
    </span>
  );
}
