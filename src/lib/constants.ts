export const EVENT_CATEGORIES = ['Jóvenes', 'Toda la iglesia', 'Parejas', 'Líderes'] as const;
export const USER_ROLES = ['admin', 'miembro', 'lider_pgm', 'pastor'] as const;
export type EventCategory = typeof EVENT_CATEGORIES[number];
export type UserRole = typeof USER_ROLES[number];