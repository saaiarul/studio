"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { StarRating } from '@/components/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { addFeedback } from '@/lib/data';

type ReviewFormProps = {
  businessId: string;
  googleReviewLink: string;
};

export function ReviewForm({ businessId, googleReviewLink }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
          await addFeedback(businessId, { rating, comment });
          setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <CardTitle className="text-xl mb-2">Thank you!</CardTitle>
        <p className="text-muted-foreground">Your feedback has been submitted and will help us improve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <Label className="text-base">How was your experience?</Label>
        <div className="flex justify-center">
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
      </div>
      {rating > 0 && (
        <div className="space-y-2 animate-in fade-in-50 duration-500">
          <Label htmlFor="comment">Tell us more (optional)</Label>
          <Textarea
            id="comment"
            placeholder="What could we do better?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      )}
      <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading || rating === 0}>
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
