import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const colors = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-rose-500 to-pink-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-sky-500 to-blue-600",
  "bg-gradient-to-br from-amber-500 to-orange-600",
  "bg-gradient-to-br from-violet-500 to-fuchsia-600",
];

export const getColor = (index) =>
  colors[index % colors.length];
