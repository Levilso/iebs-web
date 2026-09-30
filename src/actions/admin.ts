import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { db } from '../db/client';
import { users, invitationTokens, sessions } from '../db/schema';
import { generateToken } from '../lib/auth';
import crypto from 'node:crypto';
import { and, eq } from 'drizzle-orm';

const requireAdmin = (context: { locals: { user: { role: string } | null } }) => {
  if (context.locals.user?.role !== 'admin') {
    throw new ActionError({ code: 'UNAUTHORIZED', message: 'Solo un administrador puede gestionar usuarios.' });
  }
};

const activeAdminCount = async () => {
  const admins = await db.select({ id: users.id }).from(users)
    .where(and(eq(users.role, 'admin'), eq(users.status, 'active')));
  return admins.length;
};

export const admin = {
  createUserByAdmin: defineAction({
    input: z.object({
      email: z.email(),
      name: z.string().min(2),
      role: z.enum(['miembro', 'lider_pgm', 'pastor', 'admin']),
    }),
    handler: async (input, context) => {
      const normalizedEmail = input.email.toLowerCase().trim();
      requireAdmin(context);
  
      const userId = crypto.randomUUID();
      const { rawToken, tokenHash } = generateToken();
  
      // Expiración del enlace en 48 horas
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  
      // Guardar usuario e invitación en la BD
      await db.insert(users).values({
        id: userId,
        email: normalizedEmail,
        name: input.name,
        role: input.role,
        status: 'pending_password',
      });
  
      await db.insert(invitationTokens).values({
        id: crypto.randomUUID(),
        userId: userId,
        tokenHash: tokenHash,
        expiresAt: expiresAt,
      });
  
      // Generar el enlace de invitación
      const inviteLink = `${context.url.origin}/create-password?token=${rawToken}`;
  
      // Devuelve el link para que se le envíe al usuario.
      return {
        success: true,
        inviteLink,
      };
    },
  }),

  updateUser: defineAction({
    input: z.object({
      id: z.string().min(1),
      name: z.string().min(2),
      role: z.enum(['miembro', 'lider_pgm', 'pastor', 'admin']),
      status: z.enum(['pending_password', 'active', 'disabled']),
    }),
    handler: async (input, context) => {
      requireAdmin(context);
      const existing = await db.select().from(users).where(eq(users.id, input.id)).get();
      if (!existing) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'El usuario no existe.' });
      }

      const remainsActiveAdmin = input.role === 'admin' && input.status === 'active';
      if (existing.role === 'admin' && existing.status === 'active' && !remainsActiveAdmin && await activeAdminCount() <= 1) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Debe quedar al menos un administrador activo.' });
      }

      await db.update(users).set({ name: input.name, role: input.role, status: input.status })
        .where(eq(users.id, input.id));
      if (input.status !== 'active') {
        await db.delete(sessions).where(eq(sessions.userId, input.id));
      }
      return { success: true };
    },
  }),

  deleteUser: defineAction({
    input: z.object({ id: z.string().min(1) }),
    handler: async ({ id }, context) => {
      requireAdmin(context);
      if (context.locals.user?.id === id) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'No puedes eliminar tu propio usuario.' });
      }

      const existing = await db.select().from(users).where(eq(users.id, id)).get();
      if (!existing) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'El usuario no existe.' });
      }
      if (existing.role === 'admin' && existing.status === 'active' && await activeAdminCount() <= 1) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Debe quedar al menos un administrador activo.' });
      }

      await db.delete(users).where(eq(users.id, id));
      return { success: true };
    },
  }),
};