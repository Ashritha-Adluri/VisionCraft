"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React, { Suspense } from 'react';
import Provider from "./provider";

// Simple neutral loading component that doesn't need theme
function ConvexLoading() {
  return (
    <div className="
      fixed inset-0 
      bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100
      flex items-center justify-center
      z-50
    ">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-current opacity-20" />
        <p className="text-lg font-medium">Loading application...</p>
      </div>
    </div>
  );
}

function ConvexClientProvider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  return (
    <Suspense fallback={<ConvexLoading />}>
      <ConvexProvider client={convex}>
        <Provider>
          {children}
        </Provider>
      </ConvexProvider>
    </Suspense>
  );
}

export default ConvexClientProvider;