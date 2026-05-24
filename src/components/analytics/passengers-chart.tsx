"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  passengers: {
    label: "Passengers",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type ChartData = {
    month: string;
    passengers: number;
}

export function PassengerRidershipChart({ data }: { data: ChartData[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-72">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="passengers"
          type="natural"
          fill="var(--color-passengers)"
          fillOpacity={0.4}
          stroke="var(--color-passengers)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
