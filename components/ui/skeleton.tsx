"use client";

import * as React from "react";
import { cn } from "./glass-card";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl animate-shimmer border border-white/5",
        className
      )}
      {...props}
    />
  );
}
