"use client";

import React from 'react';
import GravelCalculator from '@/components/calculators/GravelCalculator';

export default function GravelPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#1a2039]">
        Gravel Driveway Calculator
      </h1>
      <GravelCalculator />
      
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4 text-[#1a2039]">
          How to Use the Calculator
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-[#1a2039]">
          <li>Enter the length of your driveway in feet</li>
          <li>Enter the width of your driveway in feet</li>
          <li>Enter the desired depth of gravel in inches</li>
          <li>Optionally enter the price per cubic yard for cost estimation</li>
          <li>Click Calculate to see the results</li>
        </ul>
      </div>
    </div>
  );
} 