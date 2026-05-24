"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  performance: {
    label: "On-Time %",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type ChartData = {
    month: string;
    performance: number;
}

export function OnTimePerformanceChart({ data }: { data: ChartData[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-72">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis 
            tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="performance" fill="var(--color-performance)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
