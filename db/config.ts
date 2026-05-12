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

    coverImage: column.text({ default: "https://res.cloudinary.com/iebs-cloudinary/image/upload/q_auto/f_auto/v1778586225/LOGO_IEBS_ahwncj.png" }),
    // ideas de columnas adicionales:
    // tags: column.text({ enum: ['Jóvenes', '...']})
    // availability, capacity
  },
})

const Organizer = defineTable({
  columns: {
    name: column.text(),
    bio: column.text(),
    
    avatar: column.text()
  }
})

  // en caso de querer indexar de otra forma:
  // ,
  // indexes: [
  //   { on: ['organizerId', 'title', 'date'], unique: true}
  // ]

export default defineDb({
  tables: { 
    EventEntry, Organizer 
  },
})

