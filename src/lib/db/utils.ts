import { v4 as uuidv4 } from 'uuid';

export function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function safeUUID(id: string | null | undefined): string | null {
  if (!id) return null;
  return isValidUUID(id) ? id : null;
}

export function newUUID(): string {
  return uuidv4();
}

export function ensureUUID(id: string | null | undefined): string | null {
  if (!id) return null;
  try {
    return isValidUUID(id) ? id : null;
  } catch (error) {
    console.error('Invalid UUID:', error);
    return null;
  }
}