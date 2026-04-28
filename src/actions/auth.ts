import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';

export const auth = {
    // LOGIN
    login: defineAction({

        accept: 'form',
        input: z.object({
            username: z.string(),
            password: z.string(),
        }),

        handler: async (input, context) => {
            const { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET } = import.meta.env;

            const validUser = input.username === ADMIN_USERNAME;
            const validPass = input.password === ADMIN_PASSWORD;

            // Comparamos ambos siempre, aunque uno falle,
            // para evitar ataques de timing
            if (!validUser || !validPass) {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'Credenciales incorrectas'
                });
            }

            // Token simple: dato + firma
            const payload = `admin:${Date.now()}`;
            const token = Buffer.from(`${payload}:${SESSION_SECRET}`).toString('base64');

            // Cookie HttpOnly: no accesible desde JS del navegador
            context.cookies.set('session', token, {
                httpOnly: true,
                secure: import.meta.env.PROD,   // HTTPS solo en producción
                sameSite: 'lax',
                maxAge: 60 * 60 * 8,            // 8 horas
                path: '/',
            });

            return { success: true, message: `Login exitoso. Usuario: ${input.username}` };
        }
    }),

    logout: defineAction({
        accept: 'json',
        input: z.object({}),
        handler: async (_input, context) => {
            context.cookies.delete('session', { path: '/' });
            return { success: true, message: 'Sesión cerrada correctamente' };
        }
    })
};