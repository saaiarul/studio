"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Customer = {
  name: string;
  phone?: string;
}

type CouponFormProps = {
  customer: Customer;
}

export function CouponForm({ customer }: CouponFormProps) {
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const handleSendCoupon = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFeedbackMessage({ type: '', text: '' });
    
    if (!customer.phone) {
        setFeedbackMessage({ type: 'info', text: 'A phone number was not provided.' });
        return;
    }

    const couponMessage = encodeURIComponent(`Hello ${customer.name}, thank you for your feedback! Here is your 10% off coupon: SALE10`);
    const whatsappUrl = `https://wa.me/${customer.phone}?text=${couponMessage}`;
    
    setFeedbackMessage({ type: 'success', text: 'Redirecting to WhatsApp to send your coupon...' });

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="text-left w-full">
      <CardHeader>
        <CardTitle>Get a Coupon!</CardTitle>
        <CardDescription>
          Click below and we'll send a 10% off coupon to you via WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Button onClick={handleSendCoupon} className="w-full">Send Coupon</Button>
          {feedbackMessage.text && (
            <p className={`text-sm text-center mt-4 ${feedbackMessage.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
              {feedbackMessage.text}
            </p>
          )}
      </CardContent>
    </Card>
  );
}
