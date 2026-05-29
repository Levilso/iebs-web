// importar utilities necesarias para definir la colección de contenido
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
// importar zod para validación de esquemas
import { z } from "zod";

const posts = defineCollection({
    loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        author: z.string(),
        tags: z.array(z.string()).optional(),
    }),
});

const sermons = defineCollection({
    loader: glob({ base: "./src/content/sermons", pattern: "**/*.md" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        preacher: z.string(),
        youtubeId: z.string(),
        series: z.string().optional(),
    }),
});

const guides = defineCollection({
    loader: glob({ base: "./src/content/guides", pattern: "**/*.md" }),
    schema: z.object({
        id: z.number().int().positive(),
        title: z.string(),
        pubDate: z.coerce.date(),
        description: z.string(),
        author: z.string(),
        scripture: z.string()
    }),
});

export const collections = { posts, sermons, guides };