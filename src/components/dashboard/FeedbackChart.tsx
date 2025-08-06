"use client"

import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, format, parseISO } from 'date-fns';

type Feedback = {
  id: string;
  rating: number;
  comment: string;
  date: string;
};

type FeedbackChartProps = {
  feedback: Feedback[];
};

export function FeedbackChart({ feedback }: FeedbackChartProps) {
  const chartData = useMemo(() => {
    const last30Days = new Map<string, { total: number; count: number }>();
    for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        last30Days.set(date, { total: 0, count: 0 });
    }

    feedback.forEach(item => {
        const date = item.date;
        if (last30Days.has(date)) {
            const day = last30Days.get(date)!;
            day.total += item.rating;
            day.count++;
        }
    });

    return Array.from(last30Days.entries())
        .map(([date, { total, count }]) => ({
            date: format(parseISO(date), 'MMM d'),
            'Avg. Rating': count > 0 ? (total / count).toFixed(1) : 0,
            'Reviews': count,
        }))
        .reverse();

  }, [feedback]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Feedback Analytics (Last 30 Days)</CardTitle>
        <CardDescription>
          Visualize your customer feedback trends over the past month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="Avg. Rating" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="Reviews" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
