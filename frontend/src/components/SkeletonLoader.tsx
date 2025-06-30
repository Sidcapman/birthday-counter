'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
}

export function BirthdayCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="w-9 h-9 rounded-lg mr-3" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="w-6 h-6 rounded-md" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-4">
        <Skeleton className="h-16 w-20 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="w-8 h-8 rounded-lg mr-3" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <BirthdayCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Name field */}
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Date field */}
      <div>
        <Skeleton className="h-4 w-12 mb-2" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Select fields */}
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-11 rounded-full" />
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </div>
    </div>
  );
}