import type { PrismaClient, Venue } from "@/generated/prisma/client";

const venues = [
  {
    name: "Kaserne Basel",
    address: "Klybeckstrasse 1B, 4057 Basel",
    neighborhood: "Kleinbasel",
    website: "https://kaserne-basel.ch",
    typicalGenres: "indie, alternative, hip-hop, world, eclectic",
    lat: 47.5635704,
    lng: 7.5906264,
  },
  {
    name: "Nordstern",
    address: "Westquaistrasse 19, 4057 Basel",
    neighborhood: "Kleinhüningen",
    website: "https://www.nordstern.com",
    typicalGenres: "techno, house",
    lat: 47.5845,
    lng: 7.5843,
  },
  {
    name: "Kaschemme",
    address: "Lehenmattstrasse 353, 4052 Basel",
    neighborhood: "St. Jakob",
    website: "https://www.kaschemme.ch",
    typicalGenres: "techno, rock, rap, eclectic",
    lat: 47.535,
    lng: 7.602,
  },
  {
    name: "Hirscheneck",
    address: "Lindenberg 23, 4058 Basel",
    neighborhood: "Kleinbasel",
    website: "https://www.hirscheneck.ch",
    typicalGenres: "punk, DIY, live bands, DJ",
    lat: 47.5590081,
    lng: 7.5952305,
  },
  {
    name: "Volkshaus Basel",
    address: "Rebgasse 12-14, 4058 Basel",
    neighborhood: "Kleinbasel",
    website: "https://volkshaus-basel.ch",
    typicalGenres: "concerts, jazz, eclectic",
    lat: 47.561175,
    lng: 7.593619,
  },
  {
    name: "Das Viertel",
    address: "Münchensteinerstrasse 81, 4052 Basel",
    neighborhood: "Dreispitz",
    website: "https://www.dasviertel.ch",
    typicalGenres: "electronic, techno, house",
    lat: 47.5378,
    lng: 7.609,
  },
];

const tagNames = [
  "techno",
  "house",
  "indie",
  "punk",
  "DIY",
  "jazz",
  "experimental",
  "hip-hop",
  "live bands",
  "eclectic",
];

function daysFromNow(days: number, hour: number, minute = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export async function seedDatabase(prisma: PrismaClient) {
  const venueRecords: Venue[] = [];
  for (const v of venues) {
    const venue = await prisma.venue.upsert({
      where: { name: v.name },
      update: v,
      create: v,
    });
    venueRecords.push(venue);
  }

  const tagRecords: Record<string, { id: string }> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tagRecords[name] = tag;
  }

  const byName = (name: string) => venueRecords.find((v) => v.name === name)!;

  const sampleEvents = [
    {
      title: "Concrete Nights: Techno Marathon",
      description:
        "An all-night techno session on the Nordstern's main floor, with a rotating lineup of local and international DJs on the boat's Rhine-facing terrace.",
      venue: byName("Nordstern"),
      tags: ["techno"],
      daysOut: 3,
      startHour: 23,
      endHour: 6,
      price: "25 CHF",
      infoUrl: "https://www.nordstern.com",
      promoter: null as string | null,
    },
    {
      title: "Kaserne Open Air: Indie Showcase",
      description:
        "Four up-and-coming indie and alternative acts play the Kaserne courtyard as the summer season winds down.",
      venue: byName("Kaserne Basel"),
      tags: ["indie", "eclectic"],
      daysOut: 5,
      startHour: 20,
      endHour: 23,
      price: "20 CHF",
      infoUrl: "https://kaserne-basel.ch",
      promoter: null as string | null,
    },
    {
      title: "Kaschemme Rooftop Rave",
      description:
        "Outdoor techno and house on the Kaschemme's industrial terrace, with a sunset-to-sunrise lineup.",
      venue: byName("Kaschemme"),
      tags: ["techno", "house"],
      daysOut: 7,
      startHour: 22,
      endHour: 5,
      price: "18 CHF",
      infoUrl: "https://www.kaschemme.ch",
      promoter: "Kaschemme Kollektiv",
    },
    {
      title: "Hirscheneck Punk Night",
      description:
        "Three DIY punk bands from the Basel underground share the bill in the Hirscheneck's no-frills back room.",
      venue: byName("Hirscheneck"),
      tags: ["punk", "DIY", "live bands"],
      daysOut: 2,
      startHour: 21,
      endHour: 1,
      price: "15 CHF",
      infoUrl: "https://www.hirscheneck.ch",
      promoter: null as string | null,
    },
    {
      title: "Jazz im Volkshaus",
      description:
        "A late-summer jazz quartet residency in the Volkshaus's historic Rebgasse hall.",
      venue: byName("Volkshaus Basel"),
      tags: ["jazz", "eclectic"],
      daysOut: 4,
      startHour: 19,
      endHour: 22,
      price: "30 CHF",
      infoUrl: "https://volkshaus-basel.ch",
      promoter: null as string | null,
    },
    {
      title: "Das Viertel: Klub Sessions",
      description:
        "Deep house and electronic selectors take over the Viertel Klub's intimate dancefloor.",
      venue: byName("Das Viertel"),
      tags: ["house", "experimental"],
      daysOut: 9,
      startHour: 22,
      endHour: 4,
      price: "20 CHF",
      infoUrl: "https://www.dasviertel.ch",
      promoter: "Viertel Gastro",
    },
  ];

  let created = 0;
  for (const e of sampleEvents) {
    const date = daysFromNow(e.daysOut, 0);
    const startTime = daysFromNow(e.daysOut, e.startHour);
    const endTime =
      e.endHour < e.startHour
        ? daysFromNow(e.daysOut + 1, e.endHour)
        : daysFromNow(e.daysOut, e.endHour);

    const existing = await prisma.event.findFirst({
      where: { title: e.title, venueId: e.venue.id },
    });
    if (existing) continue;

    await prisma.event.create({
      data: {
        title: e.title,
        description: e.description,
        date,
        startTime,
        endTime,
        venueId: e.venue.id,
        price: e.price,
        infoUrl: e.infoUrl,
        promoter: e.promoter,
        status: "approved",
        tags: {
          create: e.tags.map((t) => ({ tagId: tagRecords[t].id })),
        },
      },
    });
    created += 1;
  }

  return {
    venues: venueRecords.length,
    tags: Object.keys(tagRecords).length,
    eventsCreated: created,
  };
}
