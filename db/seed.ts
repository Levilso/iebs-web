import { db, EventEntry, Registration } from 'astro:db';
import { email } from 'astro:schema';

// https://astro.build/db/seed
export default async function() {
	
	/* EVENTOS DE PRUEBA */
	await db.insert(EventEntry).values([
		{
			title: 'Evento de prueba',
			description: 'Descripción del evento de prueba',
			info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet dui mauris. Aenean libero ex, fermentum vitae malesuada sit amet, ultrices sed nulla. Sed nec est eu odio rhoncus hendrerit. Sed varius fringilla metus, sed tincidunt purus. Ut quis nulla quis augue tincidunt accumsan. Sed egestas diam sit amet sollicitudin vehicula. In non gravida mauris.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam vulputate erat aliquam varius eleifend. Sed vitae efficitur ipsum, vitae euismod urna. Duis mattis, enim id lobortis hendrerit, velit lacus dapibus mi, eu hendrerit nisl justo eu felis. Curabitur nunc eros, efficitur id interdum non, pharetra id enim. Cras ut condimentum purus. Mauris porttitor feugiat massa, ut dapibus risus consequat in. Sed mattis tristique tellus vitae bibendum. Praesent elementum euismod dapibus. Nulla bibendum placerat commodo. Morbi auctor eu elit pellentesque tristique. Nulla commodo dolor semper est sollicitudin fringilla. ## Vestibulum hendrerit, arcu at posuere congue, ligula velit ornare erat, id venenatis lectus lorem ac odio. Sed nec tristique libero. Quisque ut nunc neque. Duis vitae scelerisque ligula. Nunc auctor nec dui eget pharetra. Suspendisse libero tortor, viverra vel massa eu, porta iaculis purus. Etiam tempor ex nec posuere condimentum. In hac habitasse platea dictumst. Phasellus eu sollicitudin lectus, sed pretium nisi. Integer elementum urna at dapibus accumsan. Aenean pellentesque nunc orci, at vulputate massa accumsan ac. Phasellus egestas dictum neque, egestas gravida lacus faucibus ac. Vestibulum id mi pretium, viverra mi in, ornare nisi. Curabitur vel velit auctor, porta lacus a, gravida lorem. In mollis sapien ante, in interdum turpis tincidunt eget. Vivamus justo quam, rhoncus quis nisi sed, maximus dapibus dolor. Nunc quis pretium libero, non cursus turpis. Sed vitae elit pulvinar magna hendrerit bibendum. Sed sollicitudin sapien arcu, id tincidunt justo aliquet sit amet. Aenean orci purus, cursus ut metus vel, faucibus viverra mauris. Pellentesque posuere dictum ligula, in pellentesque neque tincidunt vel. Nullam at risus venenatis, dictum tellus sed, dictum magna. Maecenas ornare metus auctor congue volutpat. Etiam at sapien et quam pulvinar pharetra non porttitor ipsum. Phasellus eu massa nec augue consectetur sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis quis sapien vitae diam consectetur facilisis ut id libero. Proin porttitor felis pellentesque tellus consectetur, ac facilisis orci feugiat. Fusce dapibus elit in dui consequat, id elementum mi pretium.',
			date: new Date('2026-06-19'),
			hidden: false,
			location: 'Iglesia Evangélica Bautista de Sevilla | Calle Casiodoro de Reina, 1 Sevilla',
			price: 10,
			capacity: 100,
			coverImage: './iebs-biblia-1.jpg',
			category: "Toda la iglesia"
		}
	]);

	await db.insert(EventEntry).values([
		{
			title: 'Evento de parejas',
			description: 'Un evento especial para parejas',
			info: 'Contenido del evento de prueba',
			date: new Date('2026-06-10'),
			hidden: false,
			location: 'Iglesia Evangélica Bautista de Sevilla | Calle Casiodoro de Reina, 1 Sevilla',
			price: 0,
			capacity: 70,
			coverImage: '../iebs-familia-1.jpg',
			category: "Parejas"
		}
	]);

	await db.insert(EventEntry).values([
		{
			title: 'Evento de jóvenes',
			description: 'Descripción del evento de prueba',
			info: 'Contenido del evento de prueba',
			date: new Date('2026-06-20'),
			hidden: false,
			location: 'Iglesia Evangélica Bautista de Sevilla | Calle Casiodoro de Reina, 1 Sevilla',
			price: 2.50,
			capacity: 150,
			coverImage: '../iebs-jovenes-1.jpg',
			category: "Jóvenes"
		}
	]);

	await db.insert(EventEntry).values([
		{
			title: 'Reunión de líderes',
			description: 'Descripción del evento de prueba',
			info: 'Contenido del evento de prueba',
			date: new Date('2026-07-01'),
			hidden: false,
			location: 'Iglesia Evangélica Bautista de Sevilla | Calle Casiodoro de Reina, 1 Sevilla',
			price: 0,
			capacity: 40,
			category: "Líderes"
		}
	]);

	await db.insert(EventEntry).values([
		{
			title: 'Evento de prueba',
			description: 'Pero este evento está oculto',
			info: 'Contenido del evento de prueba',
			date: new Date('2026-06-14'),
			hidden: true,
			location: 'Iglesia Evangélica Bautista de Sevilla | Calle Casiodoro de Reina, 1 Sevilla',
			price: 10,
			capacity: 10,
			coverImage: '../iebs-conversacion-1.jpg',
			category: "Toda la iglesia"
		}
	]);

	await db.insert(EventEntry).values([
		{
			title: 'Bautismos',
			description: 'Descripción del evento de prueba',
			info: 'Contenido del evento de prueba',
			date: new Date('2026-08-15'),
			hidden: false,
			location: 'Iglesia Evangélica Bautista de Sevilla | Calle Casiodoro de Reina, 1 Sevilla',
			price: 0,
			capacity: 100,
			coverImage: '../iebs-alabanza-1.jpg',
			category: "Toda la iglesia"
		}
	]);

	await db.insert(Registration).values([
		{
			eventId: 1,
			email: 'levirangel03@gmail.com',
			name: 'Levi Rangel Correa',
			num: 1,
		},
		{
			eventId: 1,
			email: 'maria.gonzalez@email.com',
			name: 'María González López',
			num: 2,
		},
		{
			eventId: 2,
			email: 'juan.martinez@email.com',
			name: 'Juan Carlos Martínez',
			num: 1,
		},
		{
			eventId: 2,
			email: 'carmen.rodriguez@email.com',
			name: 'Carmen Rodríguez García',
			num: 2,
		},
		{
			eventId: 3,
			email: 'pedro.lopez@email.com',
			name: 'Pedro López Fernández',
			num: 1,
		},
		{
			eventId: 3,
			email: 'ana.garcia@email.com',
			name: 'Ana María García Ruiz',
			num: 2,
		},
		{
			eventId: 4,
			email: 'david.sanchez@email.com',
			name: 'David Sánchez Pérez',
			num: 1,
		},
		{
			eventId: 4,
			email: 'rosa.diaz@email.com',
			name: 'Rosa María Díaz Torres',
			num: 2,
		},
		{
			eventId: 6,
			email: 'fernando.romero@email.com',
			name: 'Fernando Romero Vega',
			num: 1,
		},
		{
			eventId: 6,
			email: 'sofia.nunez@email.com',
			name: 'Sofía Núñez Jiménez',
			num: 2,
		}
	]);
}
