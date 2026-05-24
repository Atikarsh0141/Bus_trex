"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  passengers: {
    label: "Passengers/Hour",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

type ChartData = {
    route: string;
    passengers: number;
}

export function RouteEfficiencyChart({ data }: { data: ChartData[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-96">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="route"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="passengers" fill="var(--color-passengers)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
