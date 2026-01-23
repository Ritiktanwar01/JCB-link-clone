import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(image: string): string {
  if (!image) return '/placeholder.svg';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${image}`;
  if (image.startsWith('/')) return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads${image}`;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${image}`;
}
