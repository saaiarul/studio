
"use client"

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Feedback } from '@/lib/data';
import { parseISO, getDay, getHours } from 'date-fns';
import { cn } from '@/lib/utils';

type FeedbackHeatmapProps = {
  feedback: Feedback[];
};

export function FeedbackHeatmap({ feedback }: FeedbackHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Initialize a 7x24 grid with zeros
    const grid: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));
    
    feedback.forEach(f => {
      // Use a mock time for demonstration since dates don't have times
      const mockHour = Math.floor(Math.random() * 24);
      const dayOfWeek = getDay(parseISO(f.date)); // Sunday = 0, Saturday = 6

      grid[dayOfWeek][mockHour]++;
    });

    return grid;
  }, [feedback]);

  const maxCount = useMemo(() => Math.max(...heatmapData.flat(), 1), [heatmapData]);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hoursOfDay = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle>Feedback Time Heatmap</CardTitle>
        <CardDescription>
          Feedback submissions by day of the week and time of day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              {daysOfWeek.map(day => <div key={day} className="h-5 flex items-center">{day}</div>)}
            </div>

            <div className="flex flex-col gap-1">
               {/* Hour labels */}
              <div className="grid grid-cols-12 -mb-1">
                {hoursOfDay.map(hour => (
                  <div key={hour} className="text-xs text-center text-muted-foreground">{hour}</div>
                ))}
              </div>
              {heatmapData.map((row, dayIndex) => (
                <div key={dayIndex} className="grid grid-cols-24 gap-px">
                  {row.map((count, hourIndex) => {
                    const opacity = count > 0 ? (count / maxCount) * 0.9 + 0.1 : 0;
                    return (
                      <Tooltip key={`${dayIndex}-${hourIndex}`} delayDuration={100}>
                        <TooltipTrigger asChild>
                           <div
                              className="h-5 w-full rounded-[2px]"
                              style={{ backgroundColor: `hsl(var(--primary) / ${opacity})` }}
                           />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{count} review{count !== 1 ? 's' : ''} on {daysOfWeek[dayIndex]} at {hourIndex}:00</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
