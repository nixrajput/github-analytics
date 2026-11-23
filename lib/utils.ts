import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function orHidden(value: number | undefined, unit = '') {
  return value === undefined ? 'Hidden' : `${value}${unit}`;
}
