import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import crypto from 'node:crypto';
import { db } from '../db/client';
import { users, invitationTokens, sessions } from '../db/schema';
import { verifyPassword, hashPassword, hashToken } from '../lib/auth';


export const auth = {
    // LOGIN
    login: defineAction({

        accept: 'form',
        input: z.object({
            email: z.email(),
            password: z.string().min(8),
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
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'Credenciales incorrectas.'
                });
            }
                
            // verificar la contraseña con crypto.scrypt
            const isValidPassword = await verifyPassword(input.password, user.passwordHash);
            if (!isValidPassword) {
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
            password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
        }),
        handler: async (input, context) => {
            const hashed = hashToken(input.token);

            // 1. Buscar token en la BD
            const tokenRecord = await db
            .select()
            .from(invitationTokens)
            .where(eq(invitationTokens.tokenHash, hashed))
            .get();

            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'El enlace es inválido o ha caducado. Solicita uno nuevo al administrador.',
            });
            }

            // 2. Hash de la nueva contraseña
            const passwordHash = await hashPassword(input.password);

            // 3. Actualizar usuario a activo
            await db
                .update(users)
                .set({
                    passwordHash,
                    status: 'active',
                })
                .where(eq(users.id, tokenRecord.userId));

            // 4. Eliminar el token consumido
            await db.delete(invitationTokens).where(eq(invitationTokens.id, tokenRecord.id));

            // 5. Iniciar sesión automáticamente (crear sesión y cookie)
            const sessionId = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // expira en 30 días

            await db.insert(sessions).values({
                id: sessionId,
                userId: tokenRecord.userId, 
                expiresAt,
              });

            context.cookies.set('session_id', sessionId, {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD,
                sameSite: 'lax',
                expires: expiresAt,
            });

        }
    })
};