import { z } from "zod";

export const imdbIdSchema = z.string().regex(/^tt\d+$/, "Invalid IMDb ID. Must start with 'tt' followed by digits.");

export function validateImdbId(id: string) {
  return imdbIdSchema.parse(id);
}
