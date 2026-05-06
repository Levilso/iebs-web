import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
    // Convertir el archivo a base64 para subirlo a Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = (Buffer.from(arrayBuffer)).toString('base64');
    const base64 = `data:${file.type};base64,${buffer}`;

    const result = await cloudinary.uploader.upload(base64, {
        folder: 'iebs/events', // organizar las imágenes en una carpeta específica
    });

    return result.secure_url;
}