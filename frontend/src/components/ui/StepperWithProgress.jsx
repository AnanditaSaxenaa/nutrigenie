import React from "react";

export default function StepperWithProgress({ step }) {
  const totalSteps = 3;
  const progressValue = ((step + 1) / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">
          Step {step + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-[hsl(var(--foreground))]">
          {Math.round(progressValue)}%
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
        <div
          className="h-full bg-[hsl(var(--primary))] transition-all duration-500"
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </div>
  );
}
