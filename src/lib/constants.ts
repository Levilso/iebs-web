export const EVENT_CATEGORIES = ['Jóvenes', 'Toda la iglesia', 'Parejas', 'Líderes'] as const;
export type EventCategory = typeof EVENT_CATEGORIES[number];