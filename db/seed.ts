import { db, EventEntry, Registration, Organizer } from 'astro:db';
import { email } from 'astro:schema';

// https://astro.build/db/seed
export default async function() {
	await db.insert(EventEntry).values([
		{
			title: 'Evento de prueba',
			description: 'Descripción del evento de prueba',
			info: 'Contenido del evento de prueba',
			date: new Date('2026-03-19'),
			hidden: false,
			location: 'Iglesia Evangélica Bautista de Sevilla',
			price: 10,
			capacity: 100,
			// organizerName: 'Organizador de prueba',
			// organizerBio: 'Biografía del organizador de prueba',
		}
	]);

	await db.insert(Registration).values([
		{
			eventId: 1,
			email: 'levirangel03@gmail.com',
			name: 'Levi Rangel Correa',
			num: 1,
		}
	]);

	await db.insert(Organizer).values([
		{
			name: 'Organizador de prueba',
			bio: 'Biografía del organizador de prueba',
			avatar: '../public/favicon.svg'
		}
	]);
}
