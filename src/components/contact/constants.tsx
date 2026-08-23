// @ts-ignore
const vService = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SERVICE_ID : undefined;
// @ts-ignore
const vTemplate = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_TEMPLATE_ID : undefined;
// @ts-ignore
const vPublic = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_PUBLIC_KEY : undefined;

export const SERVICE_ID = process.env.NEXT_PUBLIC_VITE_SERVICE_ID || process.env.VITE_SERVICE_ID || vService || "";
export const TEMPLATE_ID = process.env.NEXT_PUBLIC_VITE_TEMPLATE_ID || process.env.VITE_TEMPLATE_ID || vTemplate || "";
export const PUBLIC_KEY = process.env.NEXT_PUBLIC_VITE_PUBLIC_KEY || process.env.VITE_PUBLIC_KEY || vPublic || "";