import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns"

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

// export const normalizePhone = (phone: string) => {
//     // normalize phone to E.164 then strip the leading + for wa.me
//     let e164 = phone;
//     try {
//       const parsed = parsePhoneNumberFromString(phone, "NG");
//       if (parsed && parsed?.isValid()) {
//         e164 = parsed?.format("E.164"); // e.g. 234803...
//       }
//     } catch (e) {
//       // fallback: use rawPhone
//     }
//     const waDigits = e164?.replace(/\D/g, ""); // remove '' and non-digits -> 234803...
//     return waDigits;
//   }


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

export const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-NG").format(num);
};

export const formatOrderDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy. h:mmaaa");
  } catch {
    return dateStr;
  }
};

export const getItemStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
      return {
        styles: "table-tag border-border-accent bg-tag-added text-brand-primary!",
        text: "Completed",
      };
    case "SHIPPED":
    case "SOURCING":
    case "IN_PROGRESS":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-brand-signal",
        text: "In Progress",
      };
    case "PENDING":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-destructive",
        text: "Pending",
      };
    // case "PAID":
    //   return {
    //     styles: "table-tag border-border-accent bg-tag-added text-brand-primary!",
    //     text: "Paid",
    //   };
    default:
      return {
        styles: "table-tag border-border-accent bg-[#F7F7F7] text-body",
        text: status || "Cancelled",
      };
  }
};

export const getOrderStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
    //For order assignment status(Procurement)
    case "ACCEPTED":
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
    case "PENDING_PAYMENT":
      return {
        styles: "table-tag border-border-accent bg-tag-queue text-brand-signal",
        text: "Pending",
      };
    default:
      return {
        styles: "table-tag border-border-main bg-tag-draft text-body-passive",
        text: "Draft",
      };
  }
};

export const getOrderAssignmentStatusStyles = (status = "") => {
  switch (status?.toUpperCase()) {
    case "ACCEPTED":
      return {
        styles:
          "table-tag border-border-main bg-storey-foreground text-heading!",
        text: "Processing",
      };
    // case "PENDING_ACCEPTANCE":
    // case "REASSIGNED":
    //   return {
    //     styles:
    //       "table-tag border-border-main bg-storey-foreground text-heading!",
    //     text: "Pending",
    //   };
    default:
      return {
        styles: "table-tag border-border-main bg-tag-draft text-body-passive",
        text: "Unassigned",
      };
  }
};


export const getUserTagStyles = (value: string = "ADMIN") => {
  if (value === "SUPER_ADMIN") {
    return {
      styles: `border-border-brand-stroke bg-tag-added text-brand-primary`,
      text: `S. admin`,
    };
  } else if (value === "PROCUREMENT_OFFICER") {
    return {
      styles: `border-border-accent bg-tag-queue text-brand-signal`,
      text: `Procurement`,
    };
  } else if (value === "WHOLESALER") {
    return {
      styles: `border-border-main bg-tag-active text-success-500`,
      text: `Wholesaler`,
    };
  } else {
    return {
      styles: `border-border-main bg-tag-draft text-body-passive`,
      text: `Admin`,
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