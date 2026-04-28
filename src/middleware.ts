import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    const isAdminRoute = context.url.pathname.startsWith('/admin');

    if (!isAdminRoute) return next(); // dejar pasar todo lo que no sea /admin

    const session = context.cookies.get('session');
    const { SESSION_SECRET } = import.meta.env;

    // Verificar que la cookie existe y contiene el SECRET
    const isValid = session && Buffer.from(session.value, 'base64')
        .toString('utf-8')
        .includes(SESSION_SECRET);

    if (!isValid) {
        return context.redirect('/login');
    }

    return next();
});