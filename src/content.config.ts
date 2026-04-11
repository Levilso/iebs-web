// importar utilities necesarias para definir la colección de contenido
import { defineCollection } from "astro:content";
// importar loaders
import { glob } from "astro/loaders";
// importar zod para validación de esquemas
import { z } from "astro/zod";

const posts = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date()
    })
})

const events = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date()
        })
})

export const collections = {
    "posts": posts,
    "events": events
};