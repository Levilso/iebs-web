import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Tabla de Eventos
export const eventEntry = sqliteTable('event_entry', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  info: text('info').notNull(),

  date: text('date').notNull(),

  hidden: integer('hidden', { mode: 'boolean' }).notNull().default(false),

  location: text('location').notNull(),
  price: real('price').notNull(),

  coverImage: text('coverImage').notNull().default(
    'https://res.cloudinary.com/iebs-cloudinary/image/upload/q_auto/f_auto/v1778772122/iebs/events/hrm0nupg3xntmge7oo3j.jpg'
  ),

  capacity: integer('capacity'),
  category: text('category'),
});

// Tabla de Inscripciones
export const registrationEntry = sqliteTable('registration', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('eventId').notNull().references(() => eventEntry.id),
  email: text('email').notNull(),
  name: text('name').notNull(),
  num: integer('num').notNull(),
  createdAt: text('createdAt').notNull(),
}, (table) => [
  uniqueIndex('unique_email_per_event').on(table.eventId, table.email),
]);

// Roles disponibles
export type Role = 'miembro' | 'lider_pgm' | 'pastor' | 'admin';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').$type<Role>().notNull().default('miembro'),
  passwordHash: text('password_hash'), // Nulo hasta que el usuario la establezca
  status: text('status', { enum: ['pending_password', 'active', 'disabled'] })
    .notNull()
    .default('pending_password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

export const invitationTokens = sqliteTable('invitation_token', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});