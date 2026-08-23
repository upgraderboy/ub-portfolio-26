const getEnvVar = (name: string): string | undefined => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[name]) return process.env[name];
    if (process.env[`NEXT_PUBLIC_${name}`]) return process.env[`NEXT_PUBLIC_${name}`];
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env) {
      // @ts-ignore
      return import.meta.env[name];
    }
  } catch (e) {}
  return undefined;
};

export const SERVICE_ID = getEnvVar("VITE_SERVICE_ID") || "";
export const TEMPLATE_ID = getEnvVar("VITE_TEMPLATE_ID") || "";
export const PUBLIC_KEY = getEnvVar("VITE_PUBLIC_KEY") || "";