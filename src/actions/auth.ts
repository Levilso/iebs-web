import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { and, eq, gt } from 'drizzle-orm';

import crypto from 'node:crypto';
import { db } from '../db/client';
import { users, invitationTokens, sessions } from '../db/schema';
import { verifyPassword, hashPassword, hashToken, fakeVerifyPassword } from '../lib/auth';

export const auth = {
    // LOGIN
    login: defineAction({

        accept: 'form',
        input: z.object({
            email: z.email(),
            password: z.string().min(8).max(128),
        }),

        handler: async (input, context) => {
            const normalizedEmail = input.email.toLowerCase().trim();

            // Buscar usuario en la BD
            const user = await db
                .select()
                .from(users)
                .where(eq(users.email, normalizedEmail))
                .get();
            
                
            // comprobación de estado: pending_password o disabled
            if (!user || !user.passwordHash || user.status !== 'active') {
                fakeVerifyPassword(input.password); // para evitar ataques de timing
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'Credenciales incorrectas.'
                });
            }
                
            // verificar la contraseña con crypto.scrypt
            const isValidPassword = await verifyPassword(input.password, user.passwordHash);
            if (!isValidPassword) {
                fakeVerifyPassword(input.password); // para evitar ataques de timing
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'Credenciales incorrectas.',
                })
            }

            //  crear regustro de sesión
            const sessionId = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // duración de 30 días

            await db.insert(sessions).values({
                id: sessionId,
                userId: user.id,
                expiresAt,
            });

            // establecer cookie HttpOnly de sesión
            context.cookies.set('session_id', sessionId, {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD, // HTTPS obligatorio en producción (Netlify)
                sameSite: 'lax',
                expires: expiresAt,
            });

            return {
                success: true,
                message: `Bienvenido/a, ${user.name}.`
            };
        },
    }),

    logout: defineAction({
        accept: 'json',
        input: z.object({}),
        handler: async (_input, context) => {
            const sessionId = context.cookies.get('session_id')?.value;

            if (sessionId){
                await db.delete(sessions).where(eq(sessions.id, sessionId));
                context.cookies.delete('session_id', { path: '/' });
            }

            return { success: true, message: 'Sesión cerrada correctamente' };
        },
    }),

    setInitialPassword: defineAction({
        input: z.object({
            token: z.string(),
            password: z.string().min(8).max(128),
        }),
        accept: 'form',
        handler: async (input, context) => {
            const hashed = hashToken(input.token);
            
            const sessionId = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // expira en 30 días

            // Hash de la nueva contraseña. 
            // Se hace antes para evitar ataques de timing y no dar pistas sobre la validez del token.
            const passwordHash = await hashPassword(input.password);

            // Atomización de la operación para evitar inconsistencias en caso de error
            // 1) Verificar token y eliminarlo -> 2) Activar contraseña del usuario -> 3) Crear sesión automáticamente
            await db.transaction(async (tx) => {

                // Verificar token en la BD y eliminarlo.
                // Un token consumido o caducado no puede volver a ser encontrado.
                const [consumed] = await tx
                    .delete(invitationTokens)
                    .where(and(
                        eq(invitationTokens.tokenHash, hashed),
                        gt(invitationTokens.expiresAt, new Date())
                    ))
                    .returning();

                if (!consumed) {
                    throw new ActionError({
                        code: 'BAD_REQUEST',
                        message: 'El enlace es inválido o ha caducado. Solicita uno nuevo al administrador.',
                    });
                }

                // Activar contraseña del usuario
                await tx
                    .update(users)
                    .set({ passwordHash, status: 'active', })
                    .where(eq(users.id, consumed.userId));

                // Crear sesión automáticamente
                await tx.insert(sessions).values({ id: sessionId, userId: consumed.userId, expiresAt });
            })

            // Crear cookie, después del éxito en la transacción.
            context.cookies.set('session_id', sessionId, {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD,
                sameSite: 'lax',
                expires: expiresAt,
            });

            return { success: true, message: 'Contraseña establecida correctamente. Bienvenido/a!' };
        }
    })
};