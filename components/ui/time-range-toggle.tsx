"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimeRange } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  disabled?: boolean;
  className?: string;
}

export const TimeRangeToggle = React.forwardRef<
  HTMLDivElement,
  TimeRangeToggleProps
>(({ value, onChange, disabled = false, className }, ref) => (
  <div
    className={cn("flex items-center space-x-2 min-w-fit", className)}
    ref={ref}
  >
    <Switch
      id="time-range"
      checked={value === "all-time"}
      disabled={disabled}
      onCheckedChange={(checked) =>
        onChange(checked ? "all-time" : "current-year")
      }
    />
    <Label htmlFor="time-range">
      {value === "current-year" ? "Current Year" : "All Time"}
    </Label>
  </div>
));

TimeRangeToggle.displayName = "TimeRangeToggle";
