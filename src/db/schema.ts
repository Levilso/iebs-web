import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

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

export const registrationEntry = sqliteTable('registration', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('eventId').notNull().references(() => eventEntry.id),
  email: text('email').notNull(),
  name: text('name').notNull(),
  num: integer('num').notNull(),
  createdAt: text('createdAt').notNull(),
}, (table) => ({
  uniqueEmailPerEvent: uniqueIndex('unique_email_per_event').on(table.eventId, table.email),
}));