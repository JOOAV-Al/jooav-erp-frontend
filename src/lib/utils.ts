import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Helper function to normalize roles to their signin routes
export const normalizeRoleForRoute = (role: string): string => {
  const normalized = role.toLowerCase();
  
  // Map SUPERADMIN to admin route
  if (normalized === "superadmin") return "admin";
  
  // Map GADMIN to gsuperadmin route
  if (normalized === "gadmin") return "gsuperadmin";
  
  // All other roles use their own route
  return normalized;
};

export function formatBytesToKB(bytes: number = 0): string {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
}