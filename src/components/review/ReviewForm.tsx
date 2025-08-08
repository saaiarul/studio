
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { StarRating } from '@/components/StarRating';
import { addFeedback, ReviewFormField, FeedbackValue } from '@/lib/data';

type ReviewFormProps = {
  businessId: string;
  googleReviewLink: string;
  customerName: string;
  onReviewSubmitted: () => void;
  formFields: ReviewFormField[];
};

export function ReviewForm({ businessId, googleReviewLink, onReviewSubmitted, customerName, formFields }: ReviewFormProps) {
  const [feedbackValues, setFeedbackValues] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleValueChange = (fieldId: string, value: string | number) => {
    setFeedbackValues(prev => ({...prev, [fieldId]: value}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    for (const field of formFields) {
        if (!field.isOptional && !feedbackValues[field.id]) {
            toast({
                variant: 'destructive',
                title: 'Please fill out all required fields',
                description: `The field "${field.label}" is required.`,
            });
            return;
        }
    }
    
    setIsLoading(true);

    const feedbackData: FeedbackValue[] = Object.entries(feedbackValues).map(([fieldId, value]) => ({
        fieldId,
        value
    }));

    try {
        // Find the first rating field and its value to check for Google Review redirect
        const firstRatingField = formFields.find(f => f.type === 'rating');
        const firstRatingValue = firstRatingField ? (feedbackValues[firstRatingField.id] as number) : 0;

        // Find the first comment field and its value
        const firstCommentField = formFields.find(f => f.type === 'comment');
        const firstCommentValue = firstCommentField ? (feedbackValues[firstCommentField.id] as string) : '';

        // If the rating is high and there's no substantial comment, redirect to Google.
        if (firstRatingValue >= 4 && (!firstCommentField || (firstCommentValue || '').trim().length < 10) && googleReviewLink) {
          toast({
            title: 'Thank you for the high rating!',
            description: 'Redirecting you to leave a public review...',
          });
          window.location.href = googleReviewLink;
        } else {
          await addFeedback(businessId, { feedbackValues: feedbackData, customerName });
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
  
  const isSubmitDisabled = () => {
    if (isLoading) return true;
    for (const field of formFields) {
        if (!field.isOptional && !feedbackValues[field.id]) {
            return true;
        }
    }
    return false;
  }


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
        <h3 className="text-xl font-semibold text-center mb-6" style={textColor}>Thanks, {customerName}!</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
        
        {formFields.map(field => (
            <div key={field.id} className="space-y-2 text-left">
                <Label htmlFor={field.id} style={mutedTextColor}>
                    {field.label} {field.isOptional ? <span className="text-xs opacity-70">(Optional)</span> : ''}
                </Label>
                {field.type === 'rating' ? (
                    <div className="flex">
                        <StarRating 
                            rating={(feedbackValues[field.id] as number) || 0} 
                            onRatingChange={(rating) => handleValueChange(field.id, rating)}
                        />
                    </div>
                ) : (
                    <Textarea
                        id={field.id}
                        placeholder="Your comments..."
                        value={(feedbackValues[field.id] as string) || ''}
                        onChange={(e) => handleValueChange(field.id, e.target.value)}
                        className="placeholder:text-white/60"
                        style={inputStyle}
                        required={!field.isOptional}
                    />
                )}
            </div>
        ))}
        

        <Button type="submit" className="w-full" style={buttonStyle} disabled={isSubmitDisabled()}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
        </form>
    </div>
  );
}
