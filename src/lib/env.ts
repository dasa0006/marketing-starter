import { z } from "zod";

const envSchema = z.object({
  /** The canonical public URL of the deployed site. Used for canonical links, sitemap, OG images, etc. */
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
