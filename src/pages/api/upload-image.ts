import type { APIRoute } from 'astro';
import { uploadImage } from '../../lib/cloudinary';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const imageFile = formData.get('coverImage');

    // Validar que se ha proporcionado un archivo de imagen válido
    if (!(imageFile instanceof File) || imageFile.size === 0) {
        return new Response(JSON.stringify({ error: 'No se ha proporcionado un archivo de imagen válido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Subida de la imagen a Cloudinary y obtención de la URL
        const imageUrl = await uploadImage(imageFile);
        return new Response(JSON.stringify({ url: imageUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.log('Error uploading image:', error);
        console.error('Error uploading image:', error);
        return new Response(JSON.stringify({ error: 'Error al subir la imagen.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}