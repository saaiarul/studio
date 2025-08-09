
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from 'lucide-react';
import { updateBusiness } from '@/lib/data';

type GoogleLinkCardProps = {
  currentLink: string;
  businessId: string;
};

export function GoogleLinkCard({ currentLink, businessId }: GoogleLinkCardProps) {
  const [link, setLink] = useState(currentLink);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await updateBusiness(businessId, { googleReviewLink: link });
         toast({
            title: "Link Updated",
            description: "Your Google Review link has been successfully updated.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the Google Review link.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Google Review Link</CardTitle>
        <CardDescription>
          This is the link users are sent to if they rate you 4 stars or more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="google-link">Your Link</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="google-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://g.page/r/your-review-link"
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? 'Saving...' : 'Save Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
