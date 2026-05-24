
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
import { Badge } from "@/components/ui/badge";
import type { Bus } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

type BusInfoTableProps = {
  data: Bus[];
};

export function BusInfoTable({ data: initialData }: BusInfoTableProps) {
  const [data, setData] = useState<Bus[]>(initialData);

  const getCapacityVariant = (percentage: number) => {
    if (percentage > 90) return "destructive";
    if (percentage > 75) return "secondary";
    return "default";
  }

  const getStatusVariant = (status: Bus['status']) => {
    switch (status) {
        case 'Running': return 'default';
        case 'Delayed': return 'destructive';
        case 'Stopped': return 'outline';
        default: return 'secondary';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Live Bus Information</CardTitle>
        <CardDescription>A real-time list of all active buses and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ETA Confidence</TableHead>
              <TableHead className="text-right">Passenger Load</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((bus) => {
                const passengerPercentage = (bus.passengers / bus.capacity) * 100;
                return (
                  <TableRow key={bus.id}>
                    <TableCell className="font-medium">{bus.id}</TableCell>
                    <TableCell>{bus.routeId}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(bus.status)}>{bus.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <span>{(bus.etaConfidence * 100).toFixed(0)}%</span>
                            <Progress value={bus.etaConfidence * 100} className="w-24 h-2"/>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                            <span>{bus.passengers} / {bus.capacity}</span>
                            <Progress value={passengerPercentage} className="w-24 h-2"/>
                        </div>
                    </TableCell>
                  </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
