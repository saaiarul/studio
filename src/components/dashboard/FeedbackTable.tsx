
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { StarRating } from '@/components/StarRating';

type Feedback = {
  id: string;
  rating: number;
  comment: string;
  date: string;
};

type FeedbackTableProps = {
  feedback: Feedback[];
};

export function FeedbackTable({ feedback }: FeedbackTableProps) {
    const exportToCSV = () => {
        const headers = ['ID', 'Date', 'Rating', 'Comment'];
        const rows = feedback.map(f => [f.id, f.date, f.rating, `"${f.comment.replace(/"/g, '""')}"`]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'feedback_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Negative Feedback</CardTitle>
          <CardDescription>
            Here's what customers with a rating of less than 4 said about you.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No negative feedback to display. Great job!
                    </TableCell>
                </TableRow>
            )}
            {feedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <StarRating rating={item.rating} size={16} readOnly />
                </TableCell>
                <TableCell className="max-w-[400px] truncate">
                    {item.comment || <span className="text-muted-foreground">No comment provided</span>}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
