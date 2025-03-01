import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (fullName: string) => {
  const words = fullName.split(" ");
  const firstInitial = words[0]?.charAt(0).toUpperCase();  
  const secondInitial = words[1]?.charAt(0).toUpperCase();  
  return firstInitial + (secondInitial || "");  
};