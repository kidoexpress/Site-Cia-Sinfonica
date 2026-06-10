import { z } from "zod";

export const StartQuizSchema = z.object({
  eventId: z.string().cuid().optional(),
  userId:  z.string().optional(),
});

export const AnswerSchema = z.object({
  questionId: z.string().min(1),
  answer: z.union([
    z.string(),
    z.array(z.string()),
    z.number(),
    z.record(z.string()),   // matrix
    z.array(z.object({      // artist/track search
      spotifyId:  z.string(),
      artistName: z.string().optional(),
      trackName:  z.string().optional(),
      genres:     z.array(z.string()).optional(),
      popularity: z.number().optional(),
    })),
  ]),
});

export const SessionParamSchema = z.object({
  sessionId: z.string().min(1),
});

export type StartQuizInput  = z.infer<typeof StartQuizSchema>;
export type AnswerInput      = z.infer<typeof AnswerSchema>;
