import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      cover: image().optional(),
      author: z.string().default("Redwoods People Services"),
      oldSlug: z.string().optional(),
    }),
});

const team = defineCollection({
  loader: glob({ base: "./src/content/team", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      intro: z.string(),
      photo: image(),
      order: z.number().default(99),
      registrations: z.array(z.string()).default([]),
      specialties: z.array(z.string()).default([]),
    }),
});

const diensten = defineCollection({
  loader: glob({ base: "./src/content/diensten", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    intro: z.string(),
    order: z.number().default(99),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
  }),
});

export const collections = { blog, team, diensten };
