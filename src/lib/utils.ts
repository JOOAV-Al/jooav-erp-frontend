import { BulkMutationResponse, DefaultBulkMutationData } from "@/interfaces/general";
import { clsx, type ClassValue } from "clsx"
import parsePhoneNumberFromString from "libphonenumber-js";
import { toast } from "sonner";
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

export const normalizePhone = (phone: string) => {
    // normalize phone to E.164 then strip the leading + for wa.me
    let e164 = phone;
    try {
      const parsed = parsePhoneNumberFromString(phone, "NG");
      if (parsed && parsed?.isValid()) {
        e164 = parsed?.format("E.164"); // e.g. 234803...
      }
    } catch (e) {
      // fallback: use rawPhone
    }
    const waDigits = e164?.replace(/\D/g, ""); // remove '' and non-digits -> 234803...
    return waDigits;
  }


/**
 * Converts a string to proper case, capitalizing the first letter of each word
 * and making the rest of the letters lowercase.
 * 
 * Examples:
 *   toProperCase("ADMIN") // "Admin"
 *   toProperCase("super-admin user") // "Super-Admin User"
 * 
 * @param text - The input string to format.
 * @returns The formatted string in proper case.
 */
export function toProperCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}



export const getItemStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    // case "COMPLETED":
    case "DELIVERED":
      return {
        styles:
          "table-tag border-border-accent bg-tag-added text-brand-primary!",
        text: "Completed",
      };
    case "SHIPPED":
    case "SOURCING":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-brand-signal",
        text: "In Progress",
      };
    case "PENDING":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-destructive",
        text: "Pending",
      };
    case "PAID":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-destructive",
        text: "Paid",
      };
    default:
      return {
        styles: "table-tag border-border-accent bg-[#F7F7F7] text-body",
        text: "Cancelled",
      };
  }
};

export const getOrderStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return {
        styles:
          "table-tag border-border-main bg-storey-foreground text-heading!",
        text: "Fulfilled",
      };
    case "ASSIGNED":
      return {
        styles:
          "table-tag border-border-main bg-storey-foreground text-heading!",
        text: "Assigned",
      };
    case "CONFIRMED":
      return {
        styles:
          "table-tag border-border-main bg-storey-foreground text-heading!",
        text: "Confirmed",
      };
    case "IN_PROGRESS":
      return {
        styles: "table-tag border-border-main bg-tag-active text-success",
        text: "Processing",
      };
    case "CANCELLED":
      return {
        styles: "table-tag border-border-main bg-tag-draft text-body-passive",
        text: "Archived",
      };
    default:
      return {
        styles: "table-tag border-border-main bg-tag-draft text-body-passive",
        text: "Draft",
      };
  }
};


export function enumToTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function handleBulkMutationMessage (response: BulkMutationResponse<DefaultBulkMutationData>, entity: string) {
  const res = response?.data
  const hasFailed = res?.failed > 0
  const hasSuccess = res?.successful > 0
  const title = `${res.successful ?? 0} Successful. ${res?.failed ?? 0} Failed`
  const message = hasFailed ? `Failed to delete some ${entity} associated to a product` : `Multiple ${entity} deleted successfully`
    toast.error(title, {
    style: { backgroundColor: hasFailed ? '#F43F5E' : "hsl(216 82% 55%)", borderRadius: "12px" },
    description: message,
    className: "force-white-toast",
  })
  return {hasFailed, hasSuccess}
}