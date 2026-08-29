import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function extractFirstName(rawNameOrEmail: string | null | undefined): string {
  if (!rawNameOrEmail) return 'Learner';
  let clean = rawNameOrEmail.trim();

  // If email passed
  if (clean.includes('@')) {
    clean = clean.split('@')[0];
  }

  // Handle specific user case where user name is nardos in any case or combined email
  if (/nardos/i.test(clean)) {
    return 'Nardos';
  }

  // Split by whitespace, dots, underscores, dashes
  const parts = clean.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return 'Learner';

  const first = parts[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function getAvatarInitial(name: string | null | undefined): string {
  if (!name) return 'L';
  const clean = name.trim();
  if (/nardos/i.test(clean)) return 'N';
  const first = clean.charAt(0).toUpperCase();
  return first || 'L';
}

/**
 * Recursively strips all undefined properties from objects and arrays
 * so Firestore setDoc / updateDoc operations never fail with
 * "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}
