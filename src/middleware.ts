import { defineMiddleware } from 'astro:middleware';
import type { MiddlewareHandler } from 'astro';
import { db } from './db/client';
import { sessions, users } from './db/schema';
import { eq } from 'drizzle-orm';

export const onRequest = defineMiddleware(async (context, next) => {
    const pathname = context.url.pathname;
    const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
    const isActionRequest = pathname === '/_actions' || pathname.startsWith('/_actions/');

    if (!isAdminRoute && !isActionRequest) {
        context.locals.user = null;
        return next();
    }

    const sessionId = context.cookies.get('session_id')?.value;

    if (!sessionId) {
        context.locals.user = null;
        return isAdminRoute ? context.redirect('/login') : next();
    }

    // Buscar sesión activa y usuario
    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId))
        .get();

    if (!result || result.session.expiresAt < new Date() || result.user.status !== 'active'){
        await db.delete(sessions).where(eq(sessions.id, sessionId));
        context.locals.user = null;
        return isAdminRoute ? context.redirect('/login') : next();
    }

    // if (isAdminRoute && result.user.role !== 'admin') {
    //     return context.redirect('/');
    // }

    // exponer usuario autenticado
    context.locals.user = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
    };

    return next();
});