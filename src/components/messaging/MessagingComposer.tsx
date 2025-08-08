"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Send, Users, User, KeyRound, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type Customer = {
  id: string;
  name: string;
  phone?: string;
};

type MessagingComposerProps = {
  customers: Customer[];
  credits: number;
};

export function MessagingComposer({ customers, credits: initialCredits }: MessagingComposerProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [recipient, setRecipient] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [credits, setCredits] = useState(initialCredits);

  const hasCredits = credits > 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCredits) {
        toast({
            variant: "destructive",
            title: "No Credits Left",
            description: "Please purchase more credits to send messages.",
        });
        return;
    }
    setIsLoading(true);

    setTimeout(() => {
        setCredits(prev => prev - 1); // Deduct credit
        toast({
            title: "Message Sent!",
            description: `Your message has been queued. Credits remaining: ${credits - 1}`,
        });
        setMessage('');
        setImage(null);
        setIsLoading(false);
    }, 1500)
  }

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingKey(true);
    // Mock API call to save the key
    setTimeout(() => {
      console.log('Saving API Key:', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your WhatsApp API key has been successfully saved.",
      });
      setIsSavingKey(false);
    }, 1000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>
              Create and send a message to your customers. Each message costs 1 credit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasCredits && (
                 <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Out of Credits</AlertTitle>
                    <AlertDescription>
                        You have no message credits left. Please buy more to continue sending messages.
                    </AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <Users />
                                All Customers ({customers.length})
                            </div>
                        </SelectItem>
                        {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center gap-2">
                                <User />
                                {customer.name}
                              </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-upload">Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" className="relative">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImagePlus className="mr-2" />
                      {image ? "Change Image" : "Upload Image"}
                      <Input 
                        id="image-upload" 
                        type="file" 
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </Button>
                  {image && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <p>{image.name}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setImage(null)}>
                        <span className="sr-only">Remove image</span>
                        &times;
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading || !hasCredits}>
                <Send className="mr-2" />
                {isLoading ? 'Sending...' : `Send Message (${credits} credits left)`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg h-fit">
            <CardHeader>
                <CardTitle>WhatsApp API</CardTitle>
                <CardDescription>Connect your WhatsApp Business API to send messages directly.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveApiKey} className="space-y-4">
                    <div>
                        <Label htmlFor="api-key">Your API Key</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                id="api-key"
                                type="password"
                                placeholder="Enter your API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={isSavingKey}>
                        {isSavingKey ? 'Saving...' : 'Save API Key'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
