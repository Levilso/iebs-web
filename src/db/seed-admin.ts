import 'dotenv/config';
import crypto from 'node:crypto';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from './schema';
import { hashPassword } from '../lib/auth';

const credentials = z.object({
  email: z.email(),
  name: z.string().trim().min(2),
  password: z.string().min(12),
});

async function seedAdmin() {
  const databaseUrl = process.env.DATABASE_URL;
  const databaseToken = process.env.DATABASE_TOKEN;

  const parsedCredentials = credentials.safeParse({
    email: process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase(),
    name: process.env.ADMIN_BOOTSTRAP_NAME,
    password: process.env.ADMIN_BOOTSTRAP_PASSWORD,
  });

  if (!databaseUrl || !databaseToken) {
    throw new Error('Set DATABASE_URL and DATABASE_TOKEN in your environment.');
  }

  if (!parsedCredentials.success) {
    throw new Error(
      'Set ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_NAME, and ADMIN_BOOTSTRAP_PASSWORD (at least 12 characters).'
    );
  }


  const client = createClient({ url: databaseUrl, authToken: databaseToken });

  try {
    const db = drizzle({ client });
    const { email, name, password } = parsedCredentials.data;
    const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

    if (existingUser) {
      if (existingUser.role === 'admin' && existingUser.status === 'active' && existingUser.passwordHash) {
        console.info('Bootstrap admin already exists; no changes made.');
        return;
      }

      throw new Error('That email already belongs to an account; refusing to modify it.');
    }

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      name,
      role: 'admin',
      status: 'active',
      passwordHash: await hashPassword(password),
    });

    console.info('Bootstrap admin created.');
  } finally {
    client.close();
  }
}

seedAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Failed to create bootstrap admin.');
  process.exitCode = 1;
});