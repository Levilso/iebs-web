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
    // organizerName: column.text(),
    // organizerBio: column.text(),

    // ideas de columnas adicionales:
    // tags: column.text({ enum: ['Jóvenes', '...']})
    // availability, capacity
  },
  // foreignKeys: [
  //   {
  //     columns: ['organizerName', 'organizerBio'],
  //     references: () => [Organizer.columns.name, Organizer.columns.bio]
  //   }
  // ]
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

