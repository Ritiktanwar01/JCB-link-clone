import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(image: string): string {
  if (!image) return '/placeholder.svg';
  
  // If already a full URL, return as is
  if (image.startsWith('http')) return image;
  
  // Get the backend base URL (without /api)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // If it's a relative path, prepend the base URL
  if (image.startsWith('/uploads/')) {
    return `${baseUrl}${image}`;
  }
  
  // If it's just a filename, add /uploads/ prefix
  return `${baseUrl}/uploads/${image}`;
}
