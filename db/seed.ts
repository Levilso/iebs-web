import { db, EventEntry, Organizer } from 'astro:db';

// https://astro.build/db/seed
export default async function() {
	// TODO
	await db.insert(EventEntry).values([
		{
		id: 1,
		title: 'Evento de prueba',
		description: 'Descripción del evento de prueba',
		content: 'Contenido del evento de prueba',
		date: new Date('2024-07-01'),
		published: new Date(),
		hidden: false,
		location: 'Madrid',
		price: 10,
		// organizerName: 'Organizador de prueba',
		// organizerBio: 'Biografía del organizador de prueba',
		metadata: { tags: ['Jóvenes', 'Cultura'] }
		}
	])

	await db.insert(Organizer).values([
		{
		name: 'Organizador de prueba',
		bio: 'Biografía del organizador de prueba',
		avatar: '../public/favicon.svg'
		}
	])
}
