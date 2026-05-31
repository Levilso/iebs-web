import { column, defineDb, defineTable, NOW } from 'astro:db';

const EventEntry = defineTable({
  columns: {
    id: column.number({ primaryKey: true }), // se traduce como INTEGER PRIMARY KEY AUTOINCREMENT
    title: column.text(),
    description: column.text(),
    info: column.text(),

    date: column.date(),
    hidden: column.boolean({ default: false }),
    
    location: column.text(),
    price: column.number(),

    coverImage: column.text({ default: "https://res.cloudinary.com/iebs-cloudinary/image/upload/q_auto/f_auto/v1778772122/iebs/events/hrm0nupg3xntmge7oo3j.jpg" }),
    capacity: column.number({ optional: true }),

    category: column.text({optional: true}),
  },
});

const Registration = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    eventId: column.number({ references: () => EventEntry.columns.id }),

    email: column.text(),
    name: column.text(),
    num: column.number(),
    createdAt: column.date({ default: NOW }),
  },
  indexes:[
    { on: ["id", "eventId"], unique: true }
  ]
});

const Organizer = defineTable({
  columns: {
    name: column.text(),
    bio: column.text(),
    
    avatar: column.text()
  }
});

export default defineDb({
  tables: { 
    EventEntry, Registration, Organizer,
  },
});
