import { defineAction, ActionError } from 'astro:actions';

import { z } from 'zod';
import { db, eq, EventEntry } from 'astro:db'

const eventEntrySchema = z.object({
    // coerce: forzar la conversión de tipos (los formularios envían todo como string)

    // aunque el ID es necesario para editar un evento existente, todavía no está definido
    // en el momento de creación de un nuevo evento, por eso lo hacemos opcional.
    // se genera en la BD automáticamente (INTEGER PRIMARY KEY AUTOINCREMENT)
    id: z.coerce.number().optional(),
    title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
    description: z.string(),
    info: z.string(),
    date: z.string().transform((str) => new Date(str)),
    hidden: z.boolean().optional().default(false),
    location: z.string(),
    price: z.coerce.number().min(0, "El precio no puede ser negativo")
});

export const event = {

    // CREAR
    createEventEntry: defineAction({
        
        accept: 'form',         // indica que recibiremos los datos desde un formulario
        input: eventEntrySchema,

        handler: async (input) => {
            const updatedEvents = await db
                .insert(EventEntry)
                .values(input)
                .returning();
            return updatedEvents[0];
        },
    }),

    // EDITAR
    updateEventEntry: defineAction({
        accept: 'form',
        input: eventEntrySchema,
        handler: async (input) => {

            // BAD REQUEST: confirmando que el ID está presente, ya que es opcional en el esquema
            if (!input.id) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: 'Se requiere el ID del evento a editar'
                });
            }

            try {
                const updatedEvents = await db
                    .update(EventEntry)
                    .set(input)
                    .where(eq(EventEntry.id, input.id))
                    .returning();
                    
                // NOT FOUND
                // si no se actualizó ningún evento, significa que el ID no existe en la base de datos
                if (updatedEvents.length === 0) {
                    throw new ActionError({
                        code: 'NOT_FOUND',
                        message: `El evento no existe o no se pudo actualizar (ID: ${input.id}).`
                    });
                }

                // Sin errores
                return updatedEvents[0];

            } catch (error) {
                if (error instanceof ActionError){
                    // errores lanzados como ActionError en el handler
                    throw error;    
                }

                // Error desconocido:
                console.error('Error inesperado en la base de datos:', error);
                // INTERNAL_ERROR
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Error inesperado durante la actualización del evento.'
                });
            }
        }
    }),

    // remember to use ActionError for missing database entries, etc. }),
    // deleteEventEntry: defineAction({
};
