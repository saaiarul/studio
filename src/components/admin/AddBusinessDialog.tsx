
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createBusiness, Business } from '@/lib/data';

type AddBusinessDialogProps = {
    onBusinessAdded: (newBusiness: Business) => void;
}

export function AddBusinessDialog({ onBusinessAdded }: AddBusinessDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const businessName = formData.get('businessName') as string;
    const ownerEmail = formData.get('ownerEmail') as string;

    try {
        const newBusiness = await createBusiness({ businessName, ownerEmail });
        onBusinessAdded(newBusiness);
        toast({
            title: "Application Submitted",
            description: `${businessName} has been added and is pending approval.`,
        });
        setIsLoading(false);
        setIsOpen(false);
    } catch(error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not create the business.",
        });
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Business
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Business</DialogTitle>
            <DialogDescription>
              Enter the details for the new business. The application will be set to 'pending' for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessName" className="text-right">
                Business Name
              </Label>
              <Input id="businessName" name="businessName" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ownerEmail" className="text-right">
                Owner's Email
              </Label>
              <Input id="ownerEmail" name="ownerEmail" type="email" required className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
