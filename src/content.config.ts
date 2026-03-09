// importar utilities necesarias para definir la colección de contenido
import { defineCollection } from "astro:content";
// importar loaders
import { glob } from "astro/loaders";
// importar zod para validación de esquemas
import { z } from "astro/zod";

export const collections = {
    posts: defineCollection({
        type: "content",
        schema: z.object({
            title: z.string(),
            description: z.string(),
            date: z.date()
        })
    }),

    events: defineCollection({
        type: "content",
        schema: z.object({
            title: z.string(),
            description: z.string(),
            date: z.date()
        })
    })
    // ,
    // authors: defineCollection({
    //     type: "data",
    //     schema: ({image}) => z.object({
    //         name: z.string(),
    //         bio: z.string(),
    //         avatar: image()
    //     })
    // })
};