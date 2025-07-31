"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

type Business = {
  id: string;
  name: string;
  ownerEmail: string;
  reviews: number;
  avgRating: number;
};

type BusinessTableProps = {
  businesses: Business[];
};

export function BusinessTable({ businesses }: BusinessTableProps) {
  return (
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
                <TableCell className="font-medium">{business.name}</TableCell>
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
  );
}
