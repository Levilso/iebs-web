export const EVENT_CATEGORIES = ['Jóvenes', 'Toda la iglesia', 'Parejas', 'Líderes'] as const;
export const USER_ROLES = ['Admin', 'Miembro', 'Líder', 'Pastor'] as const;
export type EventCategory = typeof EVENT_CATEGORIES[number];
export type UserRole = typeof USER_ROLES[number];