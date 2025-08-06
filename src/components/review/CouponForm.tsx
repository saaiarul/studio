"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';

export function CouponForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const validatePhone = (phoneNumber: string) => /^\d+$/.test(phoneNumber);
  const validateEmail = (emailAddress: string) => /\S+@\S+\.\S+/.test(emailAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage({ type: '', text: '' });

    if (!name) {
      setFeedbackMessage({ type: 'error', text: 'Please enter your name.' });
      return;
    }
    if (email && !validateEmail(email)) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (phone && !validatePhone(phone)) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a valid phone number (digits only).' });
      return;
    }

    if (!phone) {
      setFeedbackMessage({ type: 'error', text: 'Phone number is required to send the coupon via WhatsApp.' });
      return;
    }

    const couponMessage = encodeURIComponent(`Hello ${name}, thank you for your feedback! Here is your 10% off coupon: SALE10`);
    const whatsappUrl = `https://wa.me/${phone}?text=${couponMessage}`;
    
    setFeedbackMessage({ type: 'success', text: 'Redirecting to WhatsApp to send your coupon...' });

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>Get a Coupon!</CardTitle>
        <CardDescription>
          Enter your details below and we'll send a 10% off coupon to you via WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (Required)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                required 
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (for WhatsApp)</Label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="1234567890"
                    className="pl-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
             <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com"
                    className="pl-10"
                />
            </div>
          </div>
          <Button type="submit" className="w-full">Send Coupon</Button>
          {feedbackMessage.text && (
            <p className={`text-sm text-center ${feedbackMessage.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
              {feedbackMessage.text}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
