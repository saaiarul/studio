"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';

type Business = {
  id: string;
  name: string;
  ownerEmail: string;
  reviews: number;
  avgRating: number;
  reviewUrl: string;
};

type BusinessTableProps = {
  businesses: Business[];
};

export function BusinessTable({ businesses }: BusinessTableProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const qrCodeApiUrl = selectedBusiness ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(selectedBusiness.reviewUrl)}` : '';

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedBusiness(null)}>
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
                            <Button variant="link" className="p-0" onClick={() => setSelectedBusiness(business)}>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Dashboard</DropdownMenuItem>
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
            </DialogContent>
        )}
    </Dialog>
  );
}
