import { z } from "zod";

export const RegenerateSchema = z.object({
  moment: z.string().min(1),
});

export const PinTrackSchema = z.object({
  trackId:  z.string().min(1),
  moment:   z.string().min(1),
  position: z.number().int().min(0).optional(),
});

export const SearchSchema = z.object({
  q:     z.string().min(1),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export const EventParamSchema = z.object({
  eventId: z.string().min(1),
});
