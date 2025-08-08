
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Feedback } from "@/lib/data"

type SatisfactionBreakdownProps = {
  feedback: Feedback[]
}

export function SatisfactionBreakdown({ feedback }: SatisfactionBreakdownProps) {
  const chartData = React.useMemo(() => {
    const breakdown = { positive: 0, neutral: 0, negative: 0 };
    feedback.forEach(f => {
        if (f.rating >= 4) breakdown.positive++;
        else if (f.rating === 3) breakdown.neutral++;
        else breakdown.negative++;
    });

    return [
        { name: "Positive (4-5 ★)", value: breakdown.positive, fill: "hsl(var(--chart-2))" },
        { name: "Neutral (3 ★)", value: breakdown.neutral, fill: "hsl(var(--chart-4))" },
        { name: "Negative (1-2 ★)", value: breakdown.negative, fill: "hsl(var(--chart-1))" },
    ].filter(d => d.value > 0);
  }, [feedback])

  const totalReviews = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData]);

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Satisfaction Breakdown</CardTitle>
        <CardDescription>Positive, neutral, and negative feedback distribution.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180
                  const radius = 12 + innerRadius + (outerRadius - innerRadius)
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)

                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-muted-foreground text-xs"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {chartData[index].name.split(" ")[0]} (
                      {((value / totalReviews) * 100).toFixed(0)}%)
                    </text>
                  )
                }}
              >
                 {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
