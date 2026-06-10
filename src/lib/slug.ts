import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 10);

export function generateSlug(): string {
  return nanoid();
}

export function generateAccessCode(): string {
  const part = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 4);
  return `${part()}-${part()}-${part()}`;
}
