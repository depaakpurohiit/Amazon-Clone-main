"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeletonLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 p-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-4">
        {/* Trade Hive Logo */}
        <h1 className="text-4xl font-bold tracking-tight">
          Trade <span className="text-orange-500">Hive</span>
        </h1>
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-6 mt-8">
        {/* Skeleton blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
        </div>
        <div className="space-y-4 opacity-50">
          <Skeleton className="h-10 w-[250px] mx-auto" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
