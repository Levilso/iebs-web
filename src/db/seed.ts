import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eventEntry, registrationEntry } from './schema';

const db = drizzle({
  client: createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_TOKEN!,
  }),
});

async function seed() {
  const [event] = await db.insert(eventEntry).values({
    title: 'Evento de prueba',
    description: 'Descripción del evento de prueba',
    info: 'Contenido del evento de prueba',
    date: new Date('2026-03-19').toISOString(),
    hidden: false,
    location: 'Iglesia Evangélica Bautista de Sevilla',
    price: 10,
    capacity: 100,
  }).returning();

  await db.insert(registrationEntry).values({
    eventId: event.id,
    email: 'levirangel03@gmail.com',
    name: 'Levi Rangel Correa',
    num: 1,
    createdAt: new Date().toISOString(),
  });

  const events = await db.insert(eventEntry).values([
    {
      title: 'Encuentro de familias: construyendo juntos',
      description: 'Una jornada para fortalecer los vínculos familiares desde la fe.',
      info: `# Encuentro de familias: construyendo juntos

Una jornada para compartir, aprender y renovar el compromiso de cuidar nuestras relaciones. A través de conversaciones y actividades participativas, exploraremos cómo la escucha, el perdón y la esperanza pueden ayudarnos a construir hogares más unidos.

## Programa

- 10:00: bienvenida y café
- 10:30: charla sobre comunicación y vida familiar
- 12:00: dinámica para todas las edades
- 13:30: comida compartida

La actividad está abierta a familias de cualquier composición. Habrá propuestas para niñas y niños durante la charla. Cada familia puede traer algo sencillo para compartir en la comida.`,
      date: new Date('2026-10-17T10:00:00+02:00').toISOString(),
      hidden: false,
      location: 'Iglesia Evangélica Bautista de Sevilla',
      price: 0,
      capacity: 80,
      category: 'Familias',
    },
    {
      title: 'Taller de lectura bíblica',
      description: 'Herramientas prácticas para leer la Biblia en comunidad.',
      info: `# Taller de lectura bíblica

Leer la Biblia con atención y en comunidad nos ayuda a descubrir el contexto, las preguntas y la esperanza presentes en cada pasaje. En este taller practicaremos métodos sencillos que cualquier persona puede aplicar en su lectura personal.

## Qué haremos

Trabajaremos con un texto breve: observaremos sus detalles, conversaremos sobre su contexto y reflexionaremos sobre cómo dialoga con nuestra vida cotidiana. No hace falta experiencia previa ni traer materiales especializados.

La sesión tendrá momentos de explicación, lectura en grupos pequeños y puesta en común. Trae una Biblia si tienes una; también habrá ejemplares disponibles para compartir.`,
      date: new Date('2026-10-24T11:00:00+02:00').toISOString(),
      hidden: false,
      location: 'Iglesia Evangélica Bautista de Sevilla',
      price: 0,
      capacity: 40,
      category: 'Formación',
    },
    {
      title: 'Concierto de alabanza y encuentro',
      description: 'Una tarde de música, oración y convivencia abierta al barrio.',
      info: `# Concierto de alabanza y encuentro

Te invitamos a una tarde para cantar, escuchar música en directo y encontrarnos como comunidad. El repertorio reunirá canciones conocidas y composiciones actuales, con espacio para la reflexión y la oración.

## Información práctica

Las puertas abrirán media hora antes del comienzo. La entrada es libre y no es necesario reservar asiento, aunque la inscripción nos ayuda a preparar el espacio. Al terminar, compartiremos un tiempo informal de conversación.

El concierto está abierto a toda persona interesada, sin importar su experiencia o trasfondo.`,
      date: new Date('2026-11-07T18:00:00+01:00').toISOString(),
      hidden: false,
      location: 'Iglesia Evangélica Bautista de Sevilla',
      price: 0,
      capacity: 120,
      category: 'Música',
    },
    {
      title: 'Jornada solidaria de recogida de alimentos',
      description: 'Colaboramos con entidades locales para apoyar a familias de Sevilla.',
      info: `# Jornada solidaria de recogida de alimentos

Ponemos en marcha una jornada para reunir alimentos no perecederos y productos básicos destinados a familias acompañadas por entidades sociales de Sevilla. Queremos responder de forma coordinada y respetuosa a necesidades concretas de nuestro entorno.

## Qué se puede aportar

Son especialmente útiles la leche, el aceite, las legumbres, el arroz, la pasta y las conservas. Por motivos de conservación, no podremos aceptar alimentos abiertos o que necesiten refrigeración.

También hacen falta personas voluntarias para recibir las donaciones, organizarlas y preparar los lotes. Puedes participar durante toda la mañana o apuntarte a uno de los turnos.`,
      date: new Date('2026-11-14T09:30:00+01:00').toISOString(),
      hidden: false,
      location: 'Centro comunitario de la iglesia',
      price: 0,
      capacity: 60,
      category: 'Acción social',
    },
    {
      title: 'Retiro de jóvenes: tiempo para escuchar',
      description: 'Un fin de semana de reflexión, amistad y descanso.',
      info: `# Retiro de jóvenes: tiempo para escuchar

Este retiro ofrece un espacio para bajar el ritmo, compartir preguntas y descubrir nuevas formas de escuchar a Dios y a quienes nos rodean. Habrá conversaciones en grupos pequeños, momentos de silencio, música y tiempo libre.

## Detalles del encuentro

La actividad está dirigida a jóvenes desde los 16 años. El precio incluye alojamiento, comidas y materiales. Al completar la inscripción, indica cualquier necesidad alimentaria o de accesibilidad para que podamos organizarlo con antelación.

El punto de encuentro y el horario de salida se enviarán a las personas inscritas. Cada participante debe llevar ropa cómoda, artículos personales y una Biblia si dispone de ella.`,
      date: new Date('2026-11-20T18:00:00+01:00').toISOString(),
      hidden: false,
      location: 'Casa de retiros de Constantina, Sevilla',
      price: 35,
      capacity: 35,
      category: 'Jóvenes',
    },
    {
      title: 'Desayuno de bienvenida para nuevas personas',
      description: 'Un encuentro sencillo para conocer la comunidad y sus actividades.',
      info: `# Desayuno de bienvenida

Si hace poco que nos visitas, este desayuno es una oportunidad tranquila para poner caras a los nombres, conocer a algunas personas de la iglesia y preguntar lo que necesites. No hay un programa formal ni hace falta tener experiencia en una comunidad cristiana.

## Cómo será

Compartiremos café, té y algo para desayunar, seguido de una breve presentación de las actividades semanales. Después habrá tiempo para conversar y conocer los distintos grupos y servicios.

La participación es gratuita. Indica en la inscripción si tienes alguna alergia o preferencia alimentaria para que podamos tenerla en cuenta.`,
      date: new Date('2026-11-28T10:30:00+01:00').toISOString(),
      hidden: false,
      location: 'Iglesia Evangélica Bautista de Sevilla',
      price: 0,
      capacity: 30,
      category: 'Comunidad',
    },
    {
      title: 'Seminario: esperanza y cuidado emocional',
      description: 'Una conversación responsable sobre fe, bienestar y acompañamiento.',
      info: `# Esperanza y cuidado emocional

Este seminario propone una conversación cuidadosa sobre bienestar emocional, fe y acompañamiento. Contaremos con una persona invitada con experiencia en atención y escucha, y distinguiremos el apoyo comunitario de la atención profesional.

## Contenidos

Hablaremos de cómo escuchar sin juzgar, reconocer cuándo alguien necesita ayuda especializada y acompañar sin invadir. El espacio será respetuoso y no se pedirá a nadie que comparta experiencias personales.

La sesión es formativa y no sustituye una consulta psicológica o médica. La inscripción es gratuita y las plazas son limitadas para facilitar la conversación.`,
      date: new Date('2026-12-05T17:00:00+01:00').toISOString(),
      hidden: false,
      location: 'Salón principal de la iglesia',
      price: 0,
      capacity: 50,
      category: 'Formación',
    },
    {
      title: 'Taller creativo de Navidad para niñas y niños',
      description: 'Manualidades, historias y juegos para preparar la Navidad.',
      info: `# Taller creativo de Navidad

Una mañana para crear, jugar y escuchar historias relacionadas con la Navidad. Prepararemos adornos y tarjetas con materiales sencillos, y tendremos juegos cooperativos adaptados a distintas edades.

## Para las familias

El taller está pensado para niñas y niños de 5 a 12 años. Las personas adultas pueden acompañarles durante la actividad o dejarlos con el equipo responsable, tras completar la autorización al llegar.

La inscripción es gratuita e incluye todos los materiales. Si tu hija o hijo necesita algún apoyo específico, coméntalo en la inscripción para que podamos preparar una buena experiencia.`,
      date: new Date('2026-12-12T10:00:00+01:00').toISOString(),
      hidden: false,
      location: 'Aulas de la Iglesia Evangélica Bautista de Sevilla',
      price: 0,
      capacity: 25,
      category: 'Infancia',
    },
    {
      title: 'Comida comunitaria de fin de año',
      description: 'Celebramos el año compartiendo mesa y agradecimientos.',
      info: `# Comida comunitaria de fin de año

Cerramos el año reuniéndonos alrededor de la mesa. Será una ocasión para agradecer lo vivido, conocer a personas nuevas y disfrutar de una comida sin prisas en un ambiente familiar.

## Organización

La iglesia preparará el plato principal y las bebidas. Si lo deseas, puedes traer un postre o una receta para compartir; no es obligatorio. Habrá opciones para distintas necesidades alimentarias si se indican al inscribirse.

La aportación ayuda a cubrir los gastos de la comida. Si el precio supone una dificultad, ponte en contacto con el equipo organizador: queremos que nadie se quede fuera por ese motivo.`,
      date: new Date('2026-12-19T14:00:00+01:00').toISOString(),
      hidden: false,
      location: 'Salón comunitario de la iglesia',
      price: 8,
      capacity: 90,
      category: 'Comunidad',
    },
    {
      title: 'Noche de villancicos en el barrio',
      description: 'Cantamos villancicos y compartimos un chocolate caliente.',
      info: `# Noche de villancicos en el barrio

Te esperamos para recorrer algunas calles cercanas cantando villancicos y compartiendo el espíritu de la Navidad. No hace falta saber cantar: lo importante es disfrutar juntos y ofrecer un saludo cercano al vecindario.

## Recorrido y encuentro

Nos reuniremos en la entrada de la iglesia y caminaremos en grupo por un recorrido breve y accesible. Al regresar habrá chocolate caliente y una alternativa sin lactosa. Recomendamos venir con ropa de abrigo y calzado cómodo.

La actividad es gratuita y abierta a todas las edades. Las niñas y los niños deberán participar acompañados por una persona adulta responsable.`,
      date: new Date('2026-12-23T19:00:00+01:00').toISOString(),
      hidden: false,
      location: 'Salida desde la Iglesia Evangélica Bautista de Sevilla',
      price: 0,
      capacity: 100,
      category: 'Música',
    },
  ]).returning();

  const registrants = [
    { name: 'María González Romero', email: 'maria.gonzalez@example.com' },
    { name: 'Javier Rodríguez Pérez', email: 'javier.rodriguez@example.com' },
    { name: 'Lucía Fernández Ruiz', email: 'lucia.fernandez@example.com' },
    { name: 'Daniel Martínez López', email: 'daniel.martinez@example.com' },
    { name: 'Carmen Sánchez Díaz', email: 'carmen.sanchez@example.com' },
    { name: 'Pablo Romero Castro', email: 'pablo.romero@example.com' },
    { name: 'Elena Torres Moreno', email: 'elena.torres@example.com' },
    { name: 'Álvaro Jiménez Vega', email: 'alvaro.jimenez@example.com' },
    { name: 'Marta Ruiz Herrera', email: 'marta.ruiz@example.com' },
    { name: 'Sergio Navarro Gil', email: 'sergio.navarro@example.com' },
    { name: 'Ana Belén Molina León', email: 'ana.molina@example.com' },
    { name: 'David Ortega Márquez', email: 'david.ortega@example.com' },
    { name: 'Paula Delgado Ríos', email: 'paula.delgado@example.com' },
    { name: 'Miguel Ángel Cruz Soto', email: 'miguel.cruz@example.com' },
    { name: 'Claudia Reyes Flores', email: 'claudia.reyes@example.com' },
    { name: 'Andrés Romero Núñez', email: 'andres.romero@example.com' },
    { name: 'Isabel Vargas Medina', email: 'isabel.vargas@example.com' },
    { name: 'Rubén Castillo Márquez', email: 'ruben.castillo@example.com' },
    { name: 'Natalia Cabrera Ponce', email: 'natalia.cabrera@example.com' },
    { name: 'Francisco Javier León Ruiz', email: 'francisco.leon@example.com' },
    { name: 'Rocío Benítez Campos', email: 'rocio.benitez@example.com' },
    { name: 'Hugo Santana Morales', email: 'hugo.santana@example.com' },
    { name: 'Teresa Aguilar Blanco', email: 'teresa.aguilar@example.com' },
    { name: 'Marcos Pérez Roldán', email: 'marcos.perez@example.com' },
    { name: 'Silvia Fuentes Carmona', email: 'silvia.fuentes@example.com' },
    { name: 'Adrián Vega Domínguez', email: 'adrian.vega@example.com' },
    { name: 'Beatriz Herrera Márquez', email: 'beatriz.herrera@example.com' },
    { name: 'Tomás Iglesias Romero', email: 'tomas.iglesias@example.com' },
    { name: 'Eva María Santos Gil', email: 'eva.santos@example.com' },
    { name: 'José Antonio Prieto Lara', email: 'jose.prieto@example.com' },
  ];

  await db.insert(registrationEntry).values(registrants.map((registrant, index) => ({
    eventId: events[Math.floor(index / 3)].id,
    ...registrant,
    num: 1,
    createdAt: new Date().toISOString(),
  })));
}

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });