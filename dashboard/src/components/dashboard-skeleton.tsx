"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="w-1/2 h-4 skeleton-pulse" />
        <Skeleton className="w-3/4 h-8 skeleton-pulse" />
        <Skeleton className="w-1/3 h-5 skeleton-pulse" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2">
        <Skeleton className="w-3/4 h-4 skeleton-pulse" />
        <Skeleton className="w-5/6 h-4 skeleton-pulse" />
      </CardFooter>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <Skeleton className="w-20 h-5 skeleton-pulse" />
          <Skeleton className="h-4 w-52 skeleton-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[90px] skeleton-pulse" />
          <Skeleton className="h-8 w-[150px] skeleton-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full skeleton-shimmer" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="px-4 lg:px-6">
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}
