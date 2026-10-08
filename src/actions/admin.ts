import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { db } from '../db/client';
import { and, eq, lt, or } from 'drizzle-orm';
import crypto from 'node:crypto';

import { users, invitationTokens, sessions } from '../db/schema';
import { generateToken } from '../lib/auth';
import { USER_ROLES } from '../lib/constants';

export const requireAdmin = (context: { locals: { user: { role: string } | null } }) => {
  if (context.locals.user?.role !== 'admin') {
    throw new ActionError({ code: 'UNAUTHORIZED', message: 'Necesitas ser un administrador para ejecutar esta acción.' });
  }
};

const activeAdminCount = async () => {
  const admins = await db.select({ id: users.id }).from(users)
    .where(and(eq(users.role, 'admin'), eq(users.status, 'active')));
  return admins.length;
};

const INVITE_TTL_MS = 48 * 60 * 60 * 1000;

// Función para crear un token de invitación y eliminar invitaciones caducadas.
async function issueInvitation(userId: string): Promise<string> {
  // Al crear una invitación, se aprovecha para eliminar cualquier invitación caducada o anterior del mismo usuario
  await db.delete(invitationTokens).where(
    or(lt(invitationTokens.expiresAt, new Date()), eq(invitationTokens.userId, userId)),
  );

  // Crear invitación
  const { rawToken, tokenHash } = generateToken();
  await db.insert(invitationTokens).values({
    id: crypto.randomUUID(),
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });
  // Token sin hash para el usuario
  return rawToken;
}

export const admin = {

  createUserByAdmin: defineAction({
    input: z.object({
      email: z.email(),
      name: z.string().min(2),
      role: z.enum(USER_ROLES),
    }),

    handler: async (input, context) => {
      requireAdmin(context);
      const email = input.email.toLowerCase().trim();

      // Verificar si ya existe un usuario con ese correo
      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
      if (existing) {
        throw new ActionError({ code: 'CONFLICT', message: 'Ya existe un usuario con ese correo.' });
      }

      // Crear usuario con estado "pending_password"
      const userId = crypto.randomUUID();
      await db.insert(users).values({ id: userId, email, name: input.name, role: input.role, status: 'pending_password' });

      const rawToken = await issueInvitation(userId);
      const inviteLink = `${context.url.origin}/create-password?token=${rawToken}`;

      return { success: true, inviteLink, email, rawToken };
    },
  }),

  resendInvitation: defineAction({
    input: z.object({ id: z.string().min(1) }),

    handler: async ({ id }, context) => {
      requireAdmin(context);
  
      const user = await db.select().from(users).where(eq(users.id, id)).get();
      if (!user) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'El usuario no existe.' });
      }
      if (user.status !== 'pending_password') {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Este usuario ya activó su cuenta.' });
      }
  
      const rawToken = await issueInvitation(user.id);
      const inviteLink = `${context.url.origin}/create-password?token=${rawToken}`;
  
      return { success: true, inviteLink, email: user.email, rawToken };
    },
  }),

  updateUser: defineAction({
    input: z.object({
      id: z.string().min(1),
      name: z.string().min(2),
      role: z.enum(USER_ROLES),
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