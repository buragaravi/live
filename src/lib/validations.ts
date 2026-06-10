import { z } from "zod";
import { EXPIRY_OPTIONS } from "./constants";

const expiryValues = EXPIRY_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];

export const createLinkSchema = z.object({
  creatorName: z.string().min(2, "Name must be at least 2 characters").max(100),
  purpose: z.string().min(5, "Purpose must be at least 5 characters").max(500),
  destinationUrl: z.string().url("Enter a valid URL"),
  expiryOption: z.enum(expiryValues),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms and Privacy Policy" }),
  }),
  creatorLatitude: z.number().optional(),
  creatorLongitude: z.number().optional(),
  creatorAccuracy: z.number().optional(),
  shareCreatorLocation: z.boolean().optional(),
});

export const accessCodeSchema = z.object({
  accessCode: z
    .string()
    .min(8, "Enter your access code")
    .max(20)
    .transform((s) => s.trim().toUpperCase()),
});

export const consentSchema = z.object({
  eventId: z.string().cuid(),
  accepted: z.boolean(),
  termsAccepted: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracy: z.number().optional(),
});
