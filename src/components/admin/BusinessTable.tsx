"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Download } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updateBusiness } from '@/lib/data';

type Business = {
  id: string;
  name: string;
  ownerEmail: string;
  password?: string;
  reviews: number;
  avgRating: number;
  reviewUrl: string;
};

type BusinessTableProps = {
  businesses: Business[];
};

enum DialogType {
    QR_CODE,
    EDIT,
    NONE
}

export function BusinessTable({ businesses: initialBusinesses }: BusinessTableProps) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(DialogType.NONE);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const qrCodeApiUrl = selectedBusiness ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(selectedBusiness.reviewUrl)}` : '';

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBusiness) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('businessName') as string;
    const ownerEmail = formData.get('ownerEmail') as string;
    const password = formData.get('password') as string;

    const updateData: Partial<Business> = { name, ownerEmail };
    if (password) {
        updateData.password = password;
    }

    const updatedBusiness = await updateBusiness(selectedBusiness.id, updateData);
    
    if(updatedBusiness) {
        setBusinesses(prev => prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
        toast({
            title: "Business Updated",
            description: `${name} has been updated.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not find the business to update.",
        });
    }
    
    setIsLoading(false);
    setDialogType(DialogType.NONE);
    setSelectedBusiness(null);
  };


  return (
    <Dialog 
        open={dialogType !== DialogType.NONE} 
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setDialogType(DialogType.NONE);
                setSelectedBusiness(null);
            }
        }}
    >
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Owner Email</TableHead>
                <TableHead>Total Feedback</TableHead>
                <TableHead>Avg. Rating</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {businesses.map((business) => (
                <TableRow key={business.id}>
                    <TableCell className="font-medium">
                        <DialogTrigger asChild>
                            <Button variant="link" className="p-0" onClick={() => {
                                setSelectedBusiness(business);
                                setDialogType(DialogType.QR_CODE);
                            }}>
                                {business.name}
                            </Button>
                        </DialogTrigger>
                    </TableCell>
                    <TableCell>{business.ownerEmail}</TableCell>
                    <TableCell>{business.reviews}</TableCell>
                    <TableCell>{business.avgRating.toFixed(1)}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => {
                                setSelectedBusiness(business);
                                setDialogType(DialogType.EDIT);
                            }}>
                                Edit
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/${business.id}`}>View Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        {selectedBusiness && (
            <DialogContent>
                {dialogType === DialogType.QR_CODE && (
                    <>
                        <DialogHeader>
                            <DialogTitle>QR Code for {selectedBusiness.name}</DialogTitle>
                            <DialogDescription>
                                Customers can scan this code to leave a review.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
                            <div className="p-4 bg-white rounded-lg border">
                            <Image
                                src={qrCodeApiUrl}
                                alt={`QR Code for ${selectedBusiness.name}`}
                                width={200}
                                height={200}
                                data-ai-hint="qr code"
                            />
                            </div>
                            <Button onClick={() => window.open(qrCodeApiUrl)} className="w-full bg-accent hover:bg-accent/90">
                            <Download className="mr-2 h-4 w-4" />
                            Download QR Code
                            </Button>
                        </div>
                    </>
                )}
                 {dialogType === DialogType.EDIT && (
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit {selectedBusiness.name}</DialogTitle>
                            <DialogDescription>
                                Update the business details. Leave password blank to keep it unchanged.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="businessName" className="text-right">Name</Label>
                                <Input id="businessName" name="businessName" defaultValue={selectedBusiness.name} required className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ownerEmail" className="text-right">Owner's Email</Label>
                                <Input id="ownerEmail" name="ownerEmail" type="email" defaultValue={selectedBusiness.ownerEmail} required className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">New Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Unchanged" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                 )}
            </DialogContent>
        )}
    </Dialog>
  );
}
