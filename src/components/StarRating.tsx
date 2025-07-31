"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
};

export function StarRating({ rating, onRatingChange, readOnly = false, size = 32 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(index);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = (hoverRating || rating) >= index;
        return (
          <Star
            key={index}
            className={cn(
              'transition-colors duration-200',
              isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
              !readOnly && 'cursor-pointer'
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            style={{ width: size, height: size }}
          />
        );
      })}
    </div>
  );
}
