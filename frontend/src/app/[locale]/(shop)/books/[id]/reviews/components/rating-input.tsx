'use client';

import { useState } from 'react';
import RatingStars from './rating-stars';

type RatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
};

export default function RatingInput({
  value,
  onChange,
  size = 28,
}: RatingInputProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <span
      className="relative inline-flex items-center"
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(null)}
    >
      <RatingStars value={display} size={size} />
      <span className="absolute inset-0 flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index} className="relative h-full" style={{ width: size }}>
            <button
              type="button"
              role="radio"
              aria-checked={value === index - 0.5}
              aria-label={`${index - 0.5} / 5`}
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
              onClick={() => onChange(index - 0.5)}
              onMouseEnter={() => setHover(index - 0.5)}
            />
            <button
              type="button"
              role="radio"
              aria-checked={value === index}
              aria-label={`${index} / 5`}
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
              onClick={() => onChange(index)}
              onMouseEnter={() => setHover(index)}
            />
          </span>
        ))}
      </span>
    </span>
  );
}
