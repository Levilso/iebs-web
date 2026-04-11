import { db, EventEntry } from 'astro:db';
import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const info = formData.get('info') as string;
        const date = formData.get('date') as string;
        const location = formData.get('location') as string;
        const price = formData.get('price') as string;
        const hidden = formData.get('hidden') === 'on';

        if (!title || !description || !info || !date || !location || !price) {
            return new Response('Faltan datos requeridos', { status: 400 });
        }

        await db.insert(EventEntry).values({
            title,
            description,
            info,
            date: new Date(date),
            hidden,
            location,
            price: Number(price),
        });

        return new Response('Evento creado exitosamente', { status: 201 });
    } catch (error) {
        console.error('Error creando evento:', error);
        return new Response('Error al crear el evento', { status: 500 });
    }
};