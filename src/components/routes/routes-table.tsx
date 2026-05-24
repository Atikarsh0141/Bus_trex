
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Route } from "@/lib/data";
import { cn } from "@/lib/utils";

type RoutesTableProps = {
  data: Route[];
};

export function RoutesTable({ data: initialData }: RoutesTableProps) {
  const [data, setData] = useState<Route[]>(initialData);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">All Routes</CardTitle>
            <CardDescription>A list of all AI-ready bus routes in the system.</CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((route) => (
          <Collapsible key={route.id} className="border rounded-lg">
            <CollapsibleTrigger asChild>
              <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50 w-full">
                <div className="flex items-center gap-3 w-1/4 font-medium">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: route.lineColor }}></div>
                  <div className="flex flex-col">
                      <span>{route.name}</span>
                      <span className="text-xs text-muted-foreground">{route.id} ({route.direction})</span>
                  </div>
                </div>
                <div className="w-1/6"><Badge variant={route.status === 'Active' ? 'default' : 'outline'}>{route.status}</Badge></div>
                <div className="w-1/6"><Badge variant="secondary">{route.passengerDemandPattern}</Badge></div>
                <div className="w-1/6">{(route.peakHourCongestionProbability * 100).toFixed(0)}%</div>
                <div className="w-1/6">{route.stops.length} stops</div>
                <div className="flex-1 text-right flex justify-end items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:rotate-180 transition-transform">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Toggle details</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border-t bg-muted/20">
                <h4 className="font-semibold mb-2 text-sm">Stops for {route.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                  {route.stops.map(stop => (
                    <div key={stop.id} className={cn("p-2 rounded-md bg-background/50 border flex justify-between items-center", stop.isInterchange && "font-bold border-primary/50")}>
                      <span>{stop.name}</span>
                      {stop.isInterchange && <Badge variant="outline" className="text-primary border-primary/50">IC</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
