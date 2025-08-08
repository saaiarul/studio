
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { StarRating } from '@/components/StarRating';
import { addFeedback } from '@/lib/data';

type ReviewFormProps = {
  businessId: string;
  googleReviewLink: string;
  customerName: string;
  onReviewSubmitted: () => void;
  isRatingOptional?: boolean;
  isCommentRequired?: boolean;
};

export function ReviewForm({ businessId, googleReviewLink, onReviewSubmitted, customerName, isRatingOptional = false, isCommentRequired = false }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 && !isRatingOptional) {
      toast({
        variant: 'destructive',
        title: 'Please select a rating',
        description: 'You must select at least one star.',
      });
      return;
    }

    if (comment.length === 0 && isCommentRequired) {
        toast({
          variant: 'destructive',
          title: 'Please leave a comment',
          description: 'A comment is required to submit your feedback.',
        });
        return;
    }

    setIsLoading(true);

    try {
        if (rating >= 4 && comment.length === 0) {
          toast({
            title: 'Thank you for the high rating!',
            description: 'Redirecting you to leave a public review...',
          });
          window.location.href = googleReviewLink;
        } else {
          await addFeedback(businessId, { rating, comment, customerName });
          onReviewSubmitted();
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Could not submit your feedback. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || (!isRatingOptional && rating === 0) || (isCommentRequired && comment.length === 0);

  const textColor = { color: 'var(--page-text)' };
  const mutedTextColor = { color: 'var(--page-text)', opacity: 0.9 };
  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'var(--page-text)'
  };
   const buttonStyle = {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)'
  };


  return (
    <div className="animate-in fade-in-50 duration-500">
        <h3 className="text-xl font-semibold text-center mb-4" style={textColor}>Thanks, {customerName}!</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
            <Label className="text-base" style={mutedTextColor}>How was your experience? {isRatingOptional && <span className="text-xs">(Optional)</span>}</Label>
            <div className="flex justify-center">
            <StarRating rating={rating} onRatingChange={setRating} />
            </div>
        </div>
        
        <div className="space-y-2">
        <Label htmlFor="comment" style={mutedTextColor}>
            Tell us more {isCommentRequired ? <span className="text-xs">(Required)</span> : <span className="text-xs">(Optional)</span>}
        </Label>
        <Textarea
            id="comment"
            placeholder="What could we do better?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="placeholder:text-white/60"
            style={inputStyle}
            required={isCommentRequired}
        />
        </div>

        <Button type="submit" className="w-full" style={buttonStyle} disabled={isSubmitDisabled}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
        </form>
    </div>
  );
}
