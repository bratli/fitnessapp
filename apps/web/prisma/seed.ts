import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashSync } from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const exercises = [
  // --- KNE (Knee) ---
  // Nivå 1
  {
    name: "Knebøy med strikk",
    bodyPart: "Kne",
    level: 1,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Knebøy med strikk rundt knærne for å aktivere stabiliserende muskler.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Utfall fremover",
    bodyPart: "Kne",
    level: 1,
    defaultSets: 3,
    defaultReps: "8",
    description: "Utfall fremover for styrke og balanse. 8 repetisjoner på hvert ben.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Utfall bakover",
    bodyPart: "Kne",
    level: 1,
    defaultSets: 3,
    defaultReps: "8",
    description: "Utfall bakover for styrke og koordinasjon. 8 repetisjoner på hvert ben.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Utfall sideveis",
    bodyPart: "Kne",
    level: 1,
    defaultSets: 3,
    defaultReps: "8",
    description: "Sideveis utfall for lateral stabilitet. 8 repetisjoner på hvert ben.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Hopp skulder mot skulder",
    bodyPart: "Kne",
    level: 1,
    defaultSets: 3,
    defaultReps: "8",
    description: "Hopp med kontakt skulder mot skulder for å trene landingskontroll.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Nordic Hamstrings",
    bodyPart: "Kne",
    level: 1,
    defaultSets: 3,
    defaultReps: "3-5",
    description:
      "Eksentrisk hamstringsøvelse. Start på knærne og senk overkroppen kontrollert fremover.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  // Nivå 2
  {
    name: "Gående utfall",
    bodyPart: "Kne",
    level: 2,
    defaultSets: 3,
    defaultReps: "5-10m",
    description: "Gående utfall over 5-10 meter for dynamisk styrke.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Knebøy med strikk +",
    bodyPart: "Kne",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Progresjon av knebøy med strikk med økt vanskelighetsgrad.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Hopp med dytt",
    bodyPart: "Kne",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-10",
    description: "Hopp med ekstern forstyrrelse for å trene knestabilitet ved landing.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Telemarkshopp",
    bodyPart: "Kne",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Telemarkshopp for styrke og kontroll. Repetisjoner på hvert ben.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Stuperen",
    bodyPart: "Kne",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-10",
    description: "Ettbens øvelse for balanse og styrke. 8-10 repetisjoner på hvert ben.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Nordic Hamstrings",
    bodyPart: "Kne",
    level: 2,
    defaultSets: 3,
    defaultReps: "6-8",
    description:
      "Eksentrisk hamstringsøvelse, nivå 2. Økt antall repetisjoner for progresjon.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  // Nivå 3
  {
    name: "Innhopp",
    bodyPart: "Kne",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-12",
    description: "Innhopp med fokus på kontrollert landing for knestabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Ettbens knebøy",
    bodyPart: "Kne",
    level: 3,
    defaultSets: 3,
    defaultReps: "maks",
    description: "Ettbens knebøy – så mange du klarer med god kontroll.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Vendinger",
    bodyPart: "Kne",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-12",
    description: "Raske retningsendringer for å trene knekontroll i bevegelse.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Ettbens sidehopp",
    bodyPart: "Kne",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-10",
    description: "Sideveis hopp på ett ben for lateral knestabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Flyer",
    bodyPart: "Kne",
    level: 3,
    defaultSets: 3,
    defaultReps: "6-8",
    description: "Dynamisk balanse- og styrkeøvelse for kne og hofte.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },
  {
    name: "Nordic Hamstrings",
    bodyPart: "Kne",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-12",
    description:
      "Eksentrisk hamstringsøvelse, nivå 3. Full progresjon med 8-12 repetisjoner.",
    videoUrl: "https://skadefri.no/kroppsdeler/kne/skadefri-kne/",
  },

  // --- SKULDER (Shoulder) ---
  // Nivå 1
  {
    name: "Rotasjon av overkropp",
    bodyPart: "Skulder",
    level: 1,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Rotasjonsøvelse for overkroppen som aktiverer skulder og kjernemuskulatur.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Y oppover",
    bodyPart: "Skulder",
    level: 1,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Løft armene i Y-form for å styrke øvre rygg og skulderblad.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Sideliggende skuldertøyning",
    bodyPart: "Skulder",
    level: 1,
    defaultSets: 3,
    defaultReps: "30s",
    description: "Tøyning av bakre skulderkapsel i sideliggende stilling. Hold i 30 sekunder.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Utoverrotasjon",
    bodyPart: "Skulder",
    level: 1,
    defaultSets: 3,
    defaultReps: "10-20",
    description: "Utoverrotasjon av skulder for å styrke rotatorcuffen.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Slipp og grip",
    bodyPart: "Skulder",
    level: 1,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Øvelse for skulderens koordinasjon og reaksjonsevne.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  // Nivå 2
  {
    name: "Planke med pasninger",
    bodyPart: "Skulder",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Planke med ballpasninger for skulder- og kjernesstabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Pil og bue",
    bodyPart: "Skulder",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Rotasjons- og stabiliseringsøvelse for skulder.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Rotasjon av overkropp",
    bodyPart: "Skulder",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Progresjon av overkroppsrotasjon med økt motstand.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Ryggliggende skuldertøyning",
    bodyPart: "Skulder",
    level: 2,
    defaultSets: 3,
    defaultReps: "30s",
    description: "Tøyning av bakre skulder i ryggliggende stilling. Hold i 30 sekunder.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Slipp og grip",
    bodyPart: "Skulder",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Progresjon av slipp og grip med økt vanskelighetsgrad.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  // Nivå 3
  {
    name: "Rotasjon av overkropp",
    bodyPart: "Skulder",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Avansert overkroppsrotasjon for maksimal skulderstabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Senking av arm",
    bodyPart: "Skulder",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-16",
    description: "Kontrollert senking av arm for eksentrisk skulderstyrke.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Ryggliggende skuldertøyning",
    bodyPart: "Skulder",
    level: 3,
    defaultSets: 3,
    defaultReps: "30s",
    description: "Avansert tøyning av bakre skulder. Hold i 30 sekunder.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Sideliggende skuldertøyning",
    bodyPart: "Skulder",
    level: 3,
    defaultSets: 3,
    defaultReps: "30s",
    description: "Avansert tøyning i sideliggende stilling. Hold i 30 sekunder.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },
  {
    name: "Kast bakover",
    bodyPart: "Skulder",
    level: 3,
    defaultSets: 3,
    defaultReps: "10-20",
    description: "Kast bakover for eksplosiv styrke og bevegelighet i skulder.",
    videoUrl: "https://skadefri.no/kroppsdeler/skulder/skadefri-skulder/",
  },

  // --- ANKEL OG FOT (Ankle & Foot) ---
  {
    name: "Ettbens balanse",
    bodyPart: "Ankel",
    level: 1,
    defaultSets: 3,
    defaultReps: "30s",
    description: "Stå på ett ben med øynene åpne for å trene ankelstabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/ankel-og-fot/skadefri-ankel/",
  },
  {
    name: "Tåhev",
    bodyPart: "Ankel",
    level: 1,
    defaultSets: 3,
    defaultReps: "12-15",
    description: "Tåhev for å styrke leggmuskulatur og ankelstabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/ankel-og-fot/skadefri-ankel/",
  },
  {
    name: "Ettbens tåhev",
    bodyPart: "Ankel",
    level: 2,
    defaultSets: 3,
    defaultReps: "10-12",
    description: "Tåhev på ett ben for økt belastning og balanse.",
    videoUrl: "https://skadefri.no/kroppsdeler/ankel-og-fot/skadefri-ankel/",
  },
  {
    name: "Ettbens hopp",
    bodyPart: "Ankel",
    level: 3,
    defaultSets: 3,
    defaultReps: "8-10",
    description: "Hopp og landing på ett ben for dynamisk ankelstabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/ankel-og-fot/skadefri-ankel/",
  },

  // --- HOFTE OG LYSKE (Hip & Groin) ---
  {
    name: "København adduktor",
    bodyPart: "Hofte",
    level: 1,
    defaultSets: 3,
    defaultReps: "8-12",
    description: "Styrkeøvelse for adduktorene (innerlår) for å forebygge lyskeskader.",
    videoUrl: "https://skadefri.no/kroppsdeler/hofte-og-lyske/skadefri-hofte/",
  },
  {
    name: "Sideliggende hofteløft",
    bodyPart: "Hofte",
    level: 1,
    defaultSets: 3,
    defaultReps: "10-15",
    description: "Sideliggende hofteløft for å styrke hofteabduktorene.",
    videoUrl: "https://skadefri.no/kroppsdeler/hofte-og-lyske/skadefri-hofte/",
  },
  {
    name: "Sumo knebøy",
    bodyPart: "Hofte",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-12",
    description: "Bred knebøy som aktiverer adduktorer og hoftemuskulatur.",
    videoUrl: "https://skadefri.no/kroppsdeler/hofte-og-lyske/skadefri-hofte/",
  },

  // --- RYGG (Back) ---
  {
    name: "Katteøvelsen",
    bodyPart: "Rygg",
    level: 1,
    defaultSets: 3,
    defaultReps: "10-15",
    description: "Mobilisering av ryggsøylen gjennom fleksjon og ekstensjon.",
    videoUrl: "https://skadefri.no/kroppsdeler/rygg/skadefri-rygg/",
  },
  {
    name: "Bekkenløft",
    bodyPart: "Rygg",
    level: 1,
    defaultSets: 3,
    defaultReps: "10-15",
    description: "Bekkenløft for å styrke sete- og kjernemuskulatur.",
    videoUrl: "https://skadefri.no/kroppsdeler/rygg/skadefri-rygg/",
  },
  {
    name: "Planke",
    bodyPart: "Rygg",
    level: 2,
    defaultSets: 3,
    defaultReps: "30-60s",
    description: "Planke for statisk kjernestabilitet.",
    videoUrl: "https://skadefri.no/kroppsdeler/rygg/skadefri-rygg/",
  },
  {
    name: "Sideplanka",
    bodyPart: "Rygg",
    level: 2,
    defaultSets: 3,
    defaultReps: "20-30s",
    description: "Sideplanke for lateral kjernestyrke.",
    videoUrl: "https://skadefri.no/kroppsdeler/rygg/skadefri-rygg/",
  },

  // --- LÅR OG HAMSTRINGS (Thigh & Hamstrings) ---
  {
    name: "Knebøy",
    bodyPart: "Lår",
    level: 1,
    defaultSets: 3,
    defaultReps: "10-15",
    description: "Grunnleggende knebøy for styrke i lår og sete.",
    videoUrl: "https://skadefri.no/kroppsdeler/lar-og-hamstrings/skadefri-lar/",
  },
  {
    name: "Romanian Deadlift",
    bodyPart: "Lår",
    level: 2,
    defaultSets: 3,
    defaultReps: "8-12",
    description: "Stivbent markløft for å styrke hamstrings og nedre rygg.",
    videoUrl: "https://skadefri.no/kroppsdeler/lar-og-hamstrings/skadefri-lar/",
  },
  {
    name: "Nordic Hamstrings",
    bodyPart: "Lår",
    level: 3,
    defaultSets: 3,
    defaultReps: "6-10",
    description: "Eksentrisk hamstringsøvelse for å forebygge hamstringskader.",
    videoUrl: "https://skadefri.no/kroppsdeler/lar-og-hamstrings/skadefri-lar/",
  },
];

async function main() {
  console.log("Seeding exercises...");

  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: "user@fitness.app" },
    update: {},
    create: {
      username: "demo",
      email: "user@fitness.app",
      passwordHash: hashSync("password123", 10),
      name: "Default User",
    },
  });
  console.log(`Created user: ${user.name} (${user.id})`);

  // Seed exercises
  let created = 0;
  let skipped = 0;
  for (const exercise of exercises) {
    const existing = await prisma.exercise.findUnique({
      where: {
        name_bodyPart_level: {
          name: exercise.name,
          bodyPart: exercise.bodyPart,
          level: exercise.level,
        },
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.exercise.create({ data: exercise });
    created++;
  }

  console.log(`Seeded ${created} exercises (${skipped} already existed).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
