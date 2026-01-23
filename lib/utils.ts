import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(image: string): string {
  if (!image) return '/placeholder.svg';
  
  // If already a full URL, return as is
  image = image.trim();

  // If it's already an absolute URL with protocol, return as-is
  if (/^https?:\/\//i.test(image)) return image;

  // Normalize backend base URL: only strip trailing '/api' if present
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
  const baseUrl = apiUrl.replace(/\/api\/?$/i, '').replace(/\/$/, '');

  // Remove accidental leading dots (e.g. ".example.com/...") and whitespace
  image = image.replace(/^\.+/, '');

  // If image already contains the baseUrl, return a single normalized URL
  if (image.includes(baseUrl)) {
    // If it already starts with baseUrl, return it
    if (image.startsWith(baseUrl)) return image;
    // Otherwise, stitch together to avoid duplicate segments
    const suffix = image.split(baseUrl).pop() || image;
    return `${baseUrl}/${suffix.replace(/^\/+/, '')}`;
  }

  // If image looks like a domain/path without protocol (example.com/...), assume https
  if (/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/.*$/.test(image)) {
    return `https://${image.replace(/^\/+/, '')}`;
  }

  // If it's a server-relative uploads path, attach to baseUrl
  if (image.startsWith('/uploads/')) {
    return `${baseUrl}${image}`;
  }

  // If it's an uploads path missing leading slash, add it
  if (image.startsWith('uploads/')) {
    return `${baseUrl}/${image}`;
  }

  // Otherwise treat as a filename and place under /uploads/
  return `${baseUrl}/uploads/${image.replace(/^\/+/, '')}`;
}
