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

export function truncateText(text: string, maxLength: number=30): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}

export const downloadFileWithBlob = (blobLink: string) => {
  // Create a temporary anchor element
  const link = document.createElement("a");
  // Set the href to the blob URL
  link.href = blobLink
  // Set the download attribute with a desired filename
  link.download = "template.csv"; // Or a more descriptive name
  // Programmatically click the link to trigger the download
  document.body.appendChild(link); // Append to body is good practice, though often not strictly necessary for programmatic clicks
  link.click();
  document.body.removeChild(link); // Clean up the temporary link
  console.log("download initiated"); 
}