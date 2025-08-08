
"use client"

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, format, parseISO } from 'date-fns';
import type { Feedback } from '@/lib/data';

type FeedbackTrendsProps = {
  feedback: Feedback[];
};

export function FeedbackTrends({ feedback }: FeedbackTrendsProps) {
  const chartData = useMemo(() => {
    const last30Days = new Map<string, { totalRating: number; count: number }>();
    for (let i = 29; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        last30Days.set(date, { totalRating: 0, count: 0 });
    }

    feedback.forEach(item => {
        const date = format(parseISO(item.date), 'yyyy-MM-dd');
        if (last30Days.has(date)) {
            const day = last30Days.get(date)!;
            day.totalRating += item.rating;
            day.count++;
        }
    });

    return Array.from(last30Days.entries())
        .map(([date, { totalRating, count }]) => ({
            date: format(parseISO(date), 'MMM d'),
            'Avg Rating': count > 0 ? (totalRating / count) : 0,
            'Reviews': count,
        }));

  }, [feedback]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Feedback Trends</CardTitle>
        <CardDescription>
          Daily average rating and review volume over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorAvgRating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="var(--color-chart-1)" fontSize={12} domain={[0, 5]} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-chart-2)" fontSize={12} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="Avg Rating" stroke="var(--color-chart-1)" fillOpacity={1} fill="url(#colorAvgRating)" />
                <Area yAxisId="right" type="monotone" dataKey="Reviews" stroke="var(--color-chart-2)" fillOpacity={1} fill="url(#colorReviews)" />
            </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
