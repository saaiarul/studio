"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Send, Users, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Customer = {
  id: string;
  name: string;
  phone?: string;
};

type MessagingComposerProps = {
  customers: Customer[];
};

export function MessagingComposer({ customers }: MessagingComposerProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [recipient, setRecipient] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        toast({
            title: "Message Sent!",
            description: `Your message has been queued for delivery to ${recipient === 'all' ? 'all customers' : 'the selected customer'}.`,
        });
        setMessage('');
        setImage(null);
        setIsLoading(false);
    }, 1500)
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>
          Create and send a message with text and an optional image to your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
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

          <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
            <Send className="mr-2" />
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
