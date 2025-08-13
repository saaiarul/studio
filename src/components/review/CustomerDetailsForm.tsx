"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { addCustomer, Business } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CustomerDetailsFormProps = {
    business: Business;
    onDetailsSubmitted: (customer: { name: string; phone?: string; email?: string }) => void;
}

export function CustomerDetailsForm({ business, onDetailsSubmitted }: CustomerDetailsFormProps) {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wantsWhatsapp, setWantsWhatsapp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validatePhone = (phoneNumber: string) => /^\d{10}$/.test(phoneNumber) || phoneNumber === '';
  const validateEmail = (emailAddress: string) => /\S+@\S+\.\S+/.test(emailAddress) || emailAddress === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({ variant: 'destructive', title: 'Please enter your name.' });
      return;
    }
    if (email && !validateEmail(email)) {
        toast({ variant: 'destructive', title: 'Please enter a valid email address.' });
        return;
    }
    if (phone && !validatePhone(phone)) {
        toast({ variant: 'destructive', title: 'Please enter a valid 10-digit phone number.'});
        return;
    }

    setIsLoading(true);
    const fullPhoneNumber = phone ? `${countryCode}${phone}` : undefined;

    try {
        const customer = await addCustomer(business.id, { name, phone: fullPhoneNumber, email });
        onDetailsSubmitted(customer);
    } catch(error) {
        toast({ variant: 'destructive', title: 'An error occurred.', description: 'Could not save customer details.'})
    } finally {
        setIsLoading(false);
    }
  };
  
  const textColor = { color: 'var(--page-text)' };
  const mutedTextColor = { color: 'var(--page-text)', opacity: 0.7 };
  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'var(--page-text)'
  };
  const buttonStyle = {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--button-text)'
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left animate-in fade-in-50 duration-500">
        <div className='text-center mb-4'>
            <h2 className="text-2xl font-headline" style={textColor}>
                {business.welcomeMessage || `Leave a review for ${business.name}`}
            </h2>
            <p style={mutedTextColor}>First, let's get your details.</p>
        </div>
      <div className="space-y-2">
        <Label htmlFor="name" style={mutedTextColor}>Name (Required)</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={mutedTextColor} />
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="John Doe" 
            required 
            className="pl-10 placeholder:text-white/60"
            style={inputStyle}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" style={mutedTextColor}>Phone Number</Label>
         <div className="flex gap-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-[80px]" style={inputStyle}>
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+91">+91</SelectItem>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+61">+61</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={mutedTextColor} />
              <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="1234567890"
                  className="pl-10 placeholder:text-white/60"
                  style={inputStyle}
                  maxLength={10}
              />
            </div>
        </div>
        <p className="text-xs" style={mutedTextColor}>A coupon is only available if you provide a phone number.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" style={mutedTextColor}>Email (Optional)</Label>
         <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={mutedTextColor} />
            <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com"
                className="pl-10 placeholder:text-white/60"
                style={inputStyle}
            />
        </div>
      </div>
      {phone && (
        <div className="flex items-center space-x-2 animate-in fade-in-50 duration-500">
            <Checkbox id="whatsapp-optin" checked={wantsWhatsapp} onCheckedChange={(checked) => setWantsWhatsapp(checked as boolean)} className="border-white/50" />
            <Label htmlFor="whatsapp-optin" className="text-sm font-normal" style={mutedTextColor}>
                I agree to receive a one-time coupon via WhatsApp.
            </Label>
        </div>
      )}
      <Button type="submit" className="w-full text-primary-foreground" style={buttonStyle} disabled={isLoading || (phone !== '' && !wantsWhatsapp)}>
        {isLoading ? 'Saving...' : 'Continue'}
      </Button>
    </form>
  );
}
