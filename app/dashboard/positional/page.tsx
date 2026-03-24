'use client'

import { Suspense } from "react";
import { PositionalFilters } from "../_components/positional-filters";

const PositionalContent = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Positional Filters */}
      <PositionalFilters />
      
      {/* Content will be added in future steps */}
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Positional analysis coming soon...</p>
      </div>
    </div>
  );
};

export default function PositionalPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <PositionalContent />
    </Suspense>
  );
}
