"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  firstReviewDate: string;
};

type CustomerListProps = {
  customers: Customer[];
};

export function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
        <Card className="shadow-lg mt-8">
            <CardHeader>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>
                    Customers who have submitted feedback will appear here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">No customers yet.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="shadow-lg mt-8">
        <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
                Here are the customers who have left you feedback.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">First Review</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone || <span className="text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>{customer.email || <span className="text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{customer.firstReviewDate}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
