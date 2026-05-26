// src/actions/registration.ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { db, eq, and, sql, EventEntry, Registration } from 'astro:db';

export const registration = {

    // CREAR INSCRIPCIÓN
    create: defineAction({
        accept: 'form',
        input: z.object({
            eventId: z.coerce.number(),
            name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
            email: z.email('Email no válido'),
            num: z.coerce.number().min(1).max(20).default(1),
            createdAt: z.coerce.date().optional().default(() => new Date()),
        }),

        handler: async (input) => {

            // Obtener el evento
            const events = await db.select().from(EventEntry)
                .where(eq(EventEntry.id, input.eventId));

            if (events.length === 0) {
                throw new ActionError({
                    code: 'NOT_FOUND',
                    message: 'El evento no existe.',
                });
            }
            const event = events[0];

            // Comprobar duplicado
            const existing = await db.select().from(Registration)
                .where(and(
                    eq(Registration.eventId, input.eventId),
                    eq(Registration.email, input.email),
                ));

            if (existing.length > 0) {
                throw new ActionError({
                    code: 'CONFLICT',
                    message: 'Ya existe una inscripción con este email para este evento.',
                });
            }

            // Comprobar cupo (si capacity no es null)
            if (event.capacity !== null) {
                const countResult = await db.select({total: sql<number>`sum(${Registration.num})`}).from(Registration).where(eq(Registration.eventId, input.eventId));                

                const ocupados = countResult[0]?.total ?? 0;
                const disponibles = event.capacity - ocupados;

                if (input.num > disponibles) {
                    throw new ActionError({
                        code: 'BAD_REQUEST',
                        message: disponibles <= 0
                            ? 'Lo sentimos, el evento está completo.'
                            : `Quedan ${disponibles} plazas disponibles.`,
                    });
                }
            }

            // Crear inscripción
            const result = await db.insert(Registration).values({
                eventId: input.eventId,
                name: input.name,
                email: input.email,
                num: input.num,
                createdAt: input.createdAt,
            }).returning();

            return {
                success: true,
                registration: result[0],
                eventTitle: event.title,
            };
        },
    }),
};