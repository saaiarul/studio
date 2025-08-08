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
};

export function ReviewForm({ businessId, googleReviewLink, onReviewSubmitted, customerName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Please select a rating',
        description: 'You must select at least one star.',
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


  return (
    <div className="animate-in fade-in-50 duration-500">
        <h3 className="text-xl font-semibold text-center mb-4 text-white">Thanks, {customerName}!</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
            <Label className="text-base text-white/90">How was your experience?</Label>
            <div className="flex justify-center">
            <StarRating rating={rating} onRatingChange={setRating} />
            </div>
        </div>
        {rating > 0 && (
            <div className="space-y-2 animate-in fade-in-50 duration-500">
            <Label htmlFor="comment" className="text-white/90">Tell us more (optional)</Label>
            <Textarea
                id="comment"
                placeholder="What could we do better?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-white/10 border-white/20 focus:bg-white/20 text-white placeholder:text-white/60"
            />
            </div>
        )}
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || rating === 0}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
        </form>
    </div>
  );
}
