'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Skeleton className="w-full h-full bg-gray-800" />
      </div>
      
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-gray-800" />
        
        {/* Genre skeleton placeholders */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16 bg-gray-800 rounded-full" />
          <Skeleton className="h-5 w-12 bg-gray-800 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 bg-gray-800" />
          <Skeleton className="h-5 w-12 bg-gray-800" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 bg-gray-800 mr-2" />
          <Skeleton className="h-4 w-8 bg-gray-800" />
        </div>
      </div>
    </Card>
  );
}
