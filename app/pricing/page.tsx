"use client";

import { PricingTable } from "@clerk/clerk-react";

export default function Pricing() {
  return (
    <div className="mt-20">
      <h2 className="font-bold text-3xl text-center mb-8">
        AI-Powered Trip Planning - Pick Your Plan
      </h2>
      <div className="max-w-xs mx-auto p-8">
        <PricingTable />
      </div>
    </div>
  );
}
