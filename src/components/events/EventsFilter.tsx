import { useState } from 'preact/hooks';
import { EVENT_CATEGORIES } from '../../lib/constants';

// EventEntryType pero con date como string —
// Objetos de tipo Date no se serializan bien
type EventItem = {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    coverImage: string;
    category?: string | null;
};

interface Props {
    events: EventItem[];
}

export default function EventsFilter({ events }: Props) {
    const [category, setCategory] = useState<string>('all');
    const now = new Date();

    // Mostrar solo eventos futuros
    const upcoming = events //.filter(e => new Date(e.date) >= now);

    const filtered = category === 'all'
        ? upcoming
        : upcoming.filter(e => e.category === category);

    return (
        <div>
            {/* Filtros por categoría */}
            <div class="flex flex-wrap gap-2 mb-8">
                <button
                    type="button"
                    onClick={() => setCategory('all')}
                    class={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer
                        ${category === 'all'
                            ? 'bg-[#0E889E] text-white border-[#0E889E]'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#0E889E] hover:text-[#0E889E]'
                        }`}
                >
                    Todos
                </button>
                {EVENT_CATEGORIES.map(cat => (
                    <button 
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        class={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer duration-400
                            ${category === cat
                                ? 'bg-[#0E889E] text-white border-none'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-[#0E889E] hover:text-[#0E889E]'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Event cards */}
            {filtered.length === 0 ? (
                <p class="text-gray-400 text-center py-12">
                    No hay eventos próximos en esta categoría.
                </p>
            ) : (
                <div class="flex flex-row flex-wrap gap-7 justify-start">   
                    {filtered.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

// No se pueden usar Astro components dentro de Preact islands
function EventCard({ event }: { event: EventItem }) {
    const dateFormatted = new Date(event.date).toLocaleDateString(undefined, {
        dateStyle: 'medium',
        timeZone: 'UTC',
    });

    return (
        <article class="bg-neutral-50 block w-80 rounded-md drop-shadow-md hover:drop-shadow-none hover:bg-neutral-100 transition duration-300 overflow-hidden">
            <a href={`/eventos/${event.id}`} aria-label={`Ver detalles de ${event.title}`}>
                <div class="w-full h-44 bg-gray-200 overflow-hidden">
                    {event.coverImage
                        ? <img src={event.coverImage} alt={event.title} class="w-full h-full object-cover" />
                        : <div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                    }
                </div>
                <div class="p-6">
                    {event.category && (
                        <span class="text-xs font-semibold text-[#0E889E] uppercase">{event.category}</span>
                    )}
                    <h2 class="font-extrabold text-2xl">{event.title}</h2>
                    <time class="text-sm" datetime={event.date}>
                        <small>{dateFormatted}</small>
                    </time>
                    <p class="mt-1">{event.description}</p>
                </div>
            </a>
        </article>
    );
}