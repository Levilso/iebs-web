import { defineAction } from 'astro:actions';

import { z } from 'zod';
import { db, EventEntry } from 'astro:db'

export const event = {
    createEventEntry: defineAction({
        // indica que recibiremos los datos desde un formulario
        accept: 'form',

        // Como las Actions utilizan Zod, tienen seguridad de tipos,
        // así, no hace falta hacer la validación de typeof {value} === 'string'
        input: z.object({
            title: z.string().min(2),
            description: z.string(),
            info: z.string(),
            date: z.string(),
            hidden: z.boolean(),
            location: z.string(),
            price: z.number()
        }),

        handler: async (input) => {
            const updatedEvents = await db
                .insert(EventEntry)
                .values(
                    {
                        title: input.title,
                        description: input.description,
                        info: input.info,
                        date: new Date(input.date),
                        hidden: input.hidden,
                        location: input.location,
                        price: input.price
                    }
                )
                .returning();
            return updatedEvents;
        },
    }),
    // deleteEventEntry: defineAction({
    // editEventEntry: defineAction({ remember to use ActionError for missing database entries, etc. }),
};
