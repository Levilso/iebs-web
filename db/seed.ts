import { db, EventEntry, Organizer } from 'astro:db';

// https://astro.build/db/seed
export default async function() {
	// TODO
	await db.insert(EventEntry).values([
		{
		title: 'Evento de prueba',
		description: 'Descripción del evento de prueba',
		info: 'Contenido del evento de prueba',
		date: new Date('2026-03-19'),
		hidden: false,
		location: 'Madrid',
		price: 10,
		// organizerName: 'Organizador de prueba',
		// organizerBio: 'Biografía del organizador de prueba',
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
