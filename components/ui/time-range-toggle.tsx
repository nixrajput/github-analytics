'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TimeRange } from '@/lib/types';

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export function TimeRangeToggle({ value, onChange }: TimeRangeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="time-range"
        checked={value === 'all-time'}
        onCheckedChange={(checked) =>
          onChange(checked ? 'all-time' : 'current-year')
        }
      />
      <Label htmlFor="time-range">
        {value === 'current-year' ? 'Current Year' : 'All Time'}
      </Label>
    </div>
  );
}