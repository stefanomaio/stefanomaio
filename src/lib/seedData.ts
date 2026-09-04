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
    lat: 47.5835,
    lng: 7.58679,
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
    lat: 47.5407,
    lng: 7.60578,
  },
  // The venues below were pulled from denkmal.org (denkmal.org/en/basel), a
  // non-commercial, locals-run Basel event calendar, along with the events
  // further down that reference them.
  {
    name: "basso",
    address: "Elsässerrheinweg 101, 4056 Basel",
    neighborhood: "St. Johann",
    website: "https://www.bassoverse.space/",
    typicalGenres: "eclectic",
    lat: 47.57246,
    lng: 7.58363,
  },
  {
    name: "Bird's Eye",
    address: "Kohlenberg 20, 4051 Basel",
    neighborhood: "Altstadt Grossbasel",
    website: "http://www.birdseye.ch/",
    typicalGenres: "jazz",
    lat: 47.555,
    lng: 7.58751,
  },
  {
    name: "Brasilea",
    address: "Westquaistrasse 39, 4019 Basel",
    neighborhood: "Kleinhüningen",
    website: "http://www.brasilea.com/",
    typicalGenres: "ambient, eclectic",
    lat: 47.586,
    lng: 7.58812,
  },
  {
    name: "Haus zum Kirschgarten",
    address: "Elisabethenstrasse 27, 4051 Basel",
    neighborhood: "Altstadt Grossbasel",
    website: "http://www.hmb.ch/museum-wohnkultur.html",
    typicalGenres: "klassik",
    lat: 47.5521,
    lng: 7.59135,
  },
  {
    name: "Heimat",
    address: "Erlenstrasse 59, 4058 Basel",
    neighborhood: "Kleinbasel",
    website: "https://www.facebook.com/heimatbasel/",
    typicalGenres: "techno, house, techhouse",
    lat: 47.569,
    lng: 7.60175,
  },
  {
    name: "HEK",
    address: "Freilager-Platz 9, 4142 Münchenstein",
    neighborhood: "Münchenstein",
    website: "https://www.hek.ch/",
    typicalGenres: "experimental",
    lat: 47.53282,
    lng: 7.609796,
  },
  {
    name: "Nebel",
    address: "Sperrstrasse 94, 4057 Basel",
    neighborhood: "Kleinbasel",
    website: "http://nebel.cloud/",
    typicalGenres: "hard techno, trance, house",
    lat: 47.5657,
    lng: 7.59645,
  },
  {
    name: "Parterre One",
    address: "Klybeckstrasse 1B, 4055 Basel",
    neighborhood: "Kleinbasel",
    website: "https://www.parterre-one.ch/de/musik-kultur/one-kultur/programm",
    typicalGenres: "amapiano, dancehall, afrobeat",
    lat: 47.5637,
    lng: 7.59108,
  },
  {
    name: "Renée",
    address: "Klingental 18, 4057 Basel",
    neighborhood: "Kleinbasel",
    website: "http://www.renee.ch",
    typicalGenres: "disco, psychedelic, eclectic",
    lat: 47.5626,
    lng: 7.59137,
  },
  {
    name: "Schall und Rauch",
    address: "Rheingasse 25, Basel",
    neighborhood: "Kleinbasel",
    website: "https://www.facebook.com/schallundrauchbar/",
    typicalGenres: "eclectic",
    lat: 47.560078,
    lng: 7.592279,
  },
  {
    name: "Sommercasino",
    address: "Münchensteinerstrasse 1, 4052 Basel",
    neighborhood: "Gundeldingen",
    website: "https://www.facebook.com/sommercasino/",
    typicalGenres: "hip-hop, post rock, eclectic",
    lat: 47.5474,
    lng: 7.59858,
  },
  {
    name: "Sudhaus",
    address: "Burgweg 7, 4058 Basel",
    neighborhood: "Kleinbasel",
    website: "https://sudhaus.ch/",
    typicalGenres: "indie rock",
    lat: 47.5582,
    lng: 7.60104,
  },
  {
    name: "Tiki-Bar",
    address: "Klybeckstrasse 241, Basel",
    neighborhood: "Kleinbasel",
    website: "http://www.tiki-bar.ch/",
    typicalGenres: "rock",
    lat: 47.5758,
    lng: 7.58832,
  },
  {
    name: "Atlantis",
    address: "Klosterberg 13, 4051 Basel",
    neighborhood: "Altstadt Grossbasel",
    website: "https://atlantis-basel.ch/",
    typicalGenres: "rock, blues",
    lat: 47.552,
    lng: 7.59057,
  },
  {
    name: "Kuppel",
    address: "Nachtigallenwäldeli 9/10, 4051 Basel",
    neighborhood: "Altstadt Grossbasel",
    website: "https://kuppel-basel.ch/",
    typicalGenres: "mashup, charts",
    lat: 47.5498,
    lng: 7.58411,
  },
  {
    name: "Quartierzentrum Union",
    address: "Klybeckstrasse 95, 4057 Basel",
    neighborhood: "Kleinbasel",
    website: null,
    typicalGenres: "open format",
    lat: 47.568882,
    lng: 7.5901537,
  },
  {
    name: "Zazaa Social Club",
    address: "Feldbergstrasse 71, 4057 Basel",
    neighborhood: "Kleinbasel",
    website: null,
    typicalGenres: "reggae, soul",
    lat: 47.56666,
    lng: 7.592423,
  },
  {
    name: "sunbeach",
    address: "Reinacherstr. 3, 4142 Münchenstein",
    neighborhood: "Münchenstein",
    website: "https://sunbea.ch/lokalitaeten/",
    typicalGenres: "rock",
    lat: 47.53021,
    lng: 7.605872,
  },
];

function daysFromNow(days: number, hour: number, minute = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

type RelativeSampleEvent = {
  title: string;
  description: string;
  venueName: string;
  tags: string[];
  daysOut: number;
  startHour: number;
  endHour: number;
  price?: string | null;
  infoUrl?: string | null;
  promoter?: string | null;
};

type AbsoluteSampleEvent = {
  title: string;
  description: string;
  venueName: string;
  tags: string[];
  date: string;
  startTime: string;
  endTime?: string | null;
  price?: string | null;
  infoUrl?: string | null;
  promoter?: string | null;
};

// A handful of hand-written demo events, always dated relative to whenever
// the seed runs so the calendar isn't empty on a fresh install.
const relativeSampleEvents: RelativeSampleEvent[] = [
  {
    title: "Concrete Nights: Techno Marathon",
    description:
      "An all-night techno session on the Nordstern's main floor, with a rotating lineup of local and international DJs on the boat's Rhine-facing terrace.",
    venueName: "Nordstern",
    tags: ["techno"],
    daysOut: 3,
    startHour: 23,
    endHour: 6,
    price: "25 CHF",
    infoUrl: "https://www.nordstern.com",
  },
  {
    title: "Kaserne Open Air: Indie Showcase",
    description:
      "Four up-and-coming indie and alternative acts play the Kaserne courtyard as the summer season winds down.",
    venueName: "Kaserne Basel",
    tags: ["indie", "eclectic"],
    daysOut: 5,
    startHour: 20,
    endHour: 23,
    price: "20 CHF",
    infoUrl: "https://kaserne-basel.ch",
  },
  {
    title: "Kaschemme Rooftop Rave",
    description:
      "Outdoor techno and house on the Kaschemme's industrial terrace, with a sunset-to-sunrise lineup.",
    venueName: "Kaschemme",
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
    venueName: "Hirscheneck",
    tags: ["punk", "DIY", "live bands"],
    daysOut: 2,
    startHour: 21,
    endHour: 1,
    price: "15 CHF",
    infoUrl: "https://www.hirscheneck.ch",
  },
  {
    title: "Jazz im Volkshaus",
    description:
      "A late-summer jazz quartet residency in the Volkshaus's historic Rebgasse hall.",
    venueName: "Volkshaus Basel",
    tags: ["jazz", "eclectic"],
    daysOut: 4,
    startHour: 19,
    endHour: 22,
    price: "30 CHF",
    infoUrl: "https://volkshaus-basel.ch",
  },
  {
    title: "Das Viertel: Klub Sessions",
    description:
      "Deep house and electronic selectors take over the Viertel Klub's intimate dancefloor.",
    venueName: "Das Viertel",
    tags: ["house", "experimental"],
    daysOut: 9,
    startHour: 22,
    endHour: 4,
    price: "20 CHF",
    infoUrl: "https://www.dasviertel.ch",
    promoter: "Viertel Gastro",
  },
];

// Real, currently-listed events pulled from denkmal.org/en/basel (a
// non-commercial, locals-run Basel event calendar). Dated to their actual
// listed date/time rather than relative to the seed run, since they're
// real events, not demo placeholders.
const absoluteSampleEvents: AbsoluteSampleEvent[] = [
  {
    title: "Flamingofarms 18th B-Day Celebration: Flavah Nice & Jus2bik",
    description: "Flamingofarms 18th B-Day Celebration: Flavah Nice & Jus2bik — via Denkmal.org.",
    venueName: "basso",
    tags: ["tropical"],
    date: "2026-09-04",
    startTime: "2026-09-04T22:00:00+02:00",
    infoUrl: "https://www.bassoverse.space/",
  },
  {
    title: "Ariel Bringuez Quintet",
    description: "Ariel Bringuez Quintet — via Denkmal.org.",
    venueName: "Bird's Eye",
    tags: ["jazz"],
    date: "2026-09-04",
    startTime: "2026-09-04T20:30:00+02:00",
    endTime: "2026-09-04T23:00:00+02:00",
    infoUrl: "http://www.birdseye.ch/",
  },
  {
    title: "Osomo Horizontal Sunset Concert & Picknick",
    description: "Osomo Horizontal Sunset Concert & Picknick — via Denkmal.org.",
    venueName: "Brasilea",
    tags: ["ambient"],
    date: "2026-09-04",
    startTime: "2026-09-04T19:30:00+02:00",
    infoUrl: "http://www.brasilea.com/",
  },
  {
    title: "Das Musikzimmer 2026 – Umbesetzt: Posta in Quartetti - Boccherinis Terzetti op.54",
    description:
      "Das Musikzimmer 2026 – Umbesetzt: Posta in Quartetti - Boccherinis Terzetti op.54 — via Denkmal.org.",
    venueName: "Haus zum Kirschgarten",
    tags: ["klassik"],
    date: "2026-09-04",
    startTime: "2026-09-04T19:30:00+02:00",
    infoUrl: "http://www.hmb.ch/museum-wohnkultur.html",
  },
  {
    title: "Noir",
    description: "Noir — via Denkmal.org.",
    venueName: "Heimat",
    tags: ["techhouse", "minimal"],
    date: "2026-09-04",
    startTime: "2026-09-04T23:00:00+02:00",
    infoUrl: "https://www.facebook.com/heimatbasel/",
  },
  {
    title: "Periphery Serpentine x Mercury Tracer: Proc Fiskal, Keiska, tibslc, Huar Huarco",
    description:
      "Periphery Serpentine x Mercury Tracer: Proc Fiskal, Keiska, tibslc, Huar Huarco — via Denkmal.org.",
    venueName: "HEK",
    tags: ["experimental"],
    date: "2026-09-04",
    startTime: "2026-09-04T19:30:00+02:00",
    endTime: "2026-09-05T00:00:00+02:00",
    infoUrl: "https://www.hek.ch/",
  },
  {
    title: "Reopening: Arien - all night long",
    description: "Reopening: Arien - all night long — via Denkmal.org.",
    venueName: "Nebel",
    tags: ["hard techno", "trance"],
    date: "2026-09-04",
    startTime: "2026-09-04T22:00:00+02:00",
    infoUrl: "http://nebel.cloud/",
  },
  {
    title: "Clubnacht: Maddix, Teocino",
    description: "Clubnacht: Maddix, Teocino — via Denkmal.org.",
    venueName: "Nordstern",
    tags: ["techno"],
    date: "2026-09-04",
    startTime: "2026-09-04T23:00:00+02:00",
    infoUrl: "https://www.facebook.com/nordsternbasel/",
  },
  {
    title: "Bashment: K, Evans, Mistic",
    description: "Bashment: K, Evans, Mistic — via Denkmal.org.",
    venueName: "Parterre One",
    tags: ["amapiano", "dancehall", "afrobeat"],
    date: "2026-09-04",
    startTime: "2026-09-04T23:00:00+02:00",
    infoUrl: "https://www.parterre-one.ch/de/musik-kultur/one-kultur/programm",
  },
  {
    title: "Lsdj",
    description: "Lsdj — via Denkmal.org.",
    venueName: "Renée",
    tags: ["psychedelic", "disco"],
    date: "2026-09-04",
    startTime: "2026-09-04T23:00:00+02:00",
    infoUrl: "http://www.renee.ch",
  },
  {
    title: "T-Deck",
    description: "T-Deck — via Denkmal.org.",
    venueName: "Schall und Rauch",
    tags: ["80s", "90s", "70s"],
    date: "2026-09-04",
    startTime: "2026-09-04T22:00:00+02:00",
    infoUrl: "https://www.facebook.com/schallundrauchbar/",
  },
  {
    title: "Umoora, Gavial Haze",
    description: "Umoora, Gavial Haze — via Denkmal.org.",
    venueName: "Sommercasino",
    tags: ["post rock"],
    date: "2026-09-04",
    startTime: "2026-09-04T20:30:00+02:00",
    infoUrl: "https://www.facebook.com/sommercasino/",
  },
  {
    title: "Friska Viljor",
    description: "Friska Viljor — via Denkmal.org.",
    venueName: "Sudhaus",
    tags: ["indie rock"],
    date: "2026-09-04",
    startTime: "2026-09-04T19:00:00+02:00",
    infoUrl: "https://sudhaus.ch/",
  },
  {
    title: "Kamikatze, Sister Knister",
    description: "Kamikatze, Sister Knister — via Denkmal.org.",
    venueName: "Tiki-Bar",
    tags: ["rock"],
    date: "2026-09-04",
    startTime: "2026-09-04T22:00:00+02:00",
    infoUrl: "http://www.tiki-bar.ch/",
  },
  {
    title: "Coruba Soundsystem",
    description: "Coruba Soundsystem — via Denkmal.org.",
    venueName: "Das Viertel",
    tags: ["dancehall", "afrobeat"],
    date: "2026-09-04",
    startTime: "2026-09-04T23:00:00+02:00",
    infoUrl: "https://www.facebook.com/viertelklubbasel/",
  },
  {
    title: "Kilmister",
    description: "Kilmister — via Denkmal.org.",
    venueName: "Atlantis",
    tags: ["rock"],
    date: "2026-09-05",
    startTime: "2026-09-05T20:30:00+02:00",
    endTime: "2026-09-05T22:30:00+02:00",
    infoUrl: "https://atlantis-basel.ch/",
  },
  {
    title: "Soul Kollage Gathering: 16Grad, Croccante, Ebbe Sand, Whookpack",
    description:
      "Soul Kollage Gathering: 16Grad, Croccante, Ebbe Sand, Whookpack — via Denkmal.org.",
    venueName: "basso",
    tags: ["soul", "hiphop"],
    date: "2026-09-05",
    startTime: "2026-09-05T22:00:00+02:00",
    infoUrl: "https://www.bassoverse.space/",
  },
  {
    title: "GameBoys",
    description: "GameBoys — via Denkmal.org.",
    venueName: "Heimat",
    tags: ["electro", "techno", "house"],
    date: "2026-09-05",
    startTime: "2026-09-05T23:00:00+02:00",
    infoUrl: "https://www.facebook.com/heimatbasel/",
  },
  {
    title: "Yolo – Saisonstart: Achtung Scharf, Sterchi, Bobby b2b DJ duregloh",
    description:
      "Yolo – Saisonstart: Achtung Scharf, Sterchi, Bobby b2b DJ duregloh — via Denkmal.org.",
    venueName: "Kuppel",
    tags: ["mashup", "charts"],
    date: "2026-09-05",
    startTime: "2026-09-05T23:00:00+02:00",
    infoUrl: "https://kuppel-basel.ch/",
  },
  {
    title: "Reopening: Nebel All-Stars",
    description: "Reopening: Nebel All-Stars — via Denkmal.org.",
    venueName: "Nebel",
    tags: ["house", "techhouse"],
    date: "2026-09-05",
    startTime: "2026-09-05T23:00:00+02:00",
    infoUrl: "http://nebel.cloud/",
  },
  {
    title: "Teletech: Alex Farell, Alt8, Bae Blade B2B Fjusha, Byorn Faster Horses, Hanaa, Jowi, kso12, Lola Cerise, Mxgn, Nvns",
    description:
      "Teletech: Alex Farell, Alt8, Bae Blade B2B Fjusha, Byorn Faster Horses, Hanaa, Jowi, kso12, Lola Cerise, Mxgn, Nvns — via Denkmal.org.",
    venueName: "Nordstern",
    tags: ["techno"],
    date: "2026-09-05",
    startTime: "2026-09-05T16:00:00+02:00",
    infoUrl: "https://www.facebook.com/nordsternbasel/",
  },
  {
    title: "A.Alavi Shows & Farre & LSDJ Disco",
    description: "A.Alavi Shows & Farre & LSDJ Disco — via Denkmal.org.",
    venueName: "Quartierzentrum Union",
    tags: ["open format"],
    date: "2026-09-05",
    startTime: "2026-09-05T20:00:00+02:00",
  },
  {
    title: "Fresh Prinz vom Bollwerk",
    description: "Fresh Prinz vom Bollwerk — via Denkmal.org.",
    venueName: "Renée",
    tags: ["latin", "disco", "jazz", "tropical"],
    date: "2026-09-05",
    startTime: "2026-09-05T23:00:00+02:00",
    infoUrl: "http://www.renee.ch",
  },
  {
    title: "Luci Bling",
    description: "Luci Bling — via Denkmal.org.",
    venueName: "Sommercasino",
    tags: ["hiphop"],
    date: "2026-09-05",
    startTime: "2026-09-05T20:00:00+02:00",
    infoUrl: "https://www.facebook.com/sommercasino/",
  },
  {
    title: "Sicanova",
    description: "Sicanova — via Denkmal.org.",
    venueName: "Das Viertel",
    tags: ["techhouse", "house"],
    date: "2026-09-05",
    startTime: "2026-09-05T23:00:00+02:00",
    infoUrl: "https://www.facebook.com/viertelklubbasel/",
  },
  {
    title: "IB and Shalaby",
    description: "IB and Shalaby — via Denkmal.org.",
    venueName: "Zazaa Social Club",
    tags: ["reggae", "soul"],
    date: "2026-09-05",
    startTime: "2026-09-05T21:00:00+02:00",
    endTime: "2026-09-06T00:00:00+02:00",
  },
  {
    title: "Spread Eagle",
    description: "Spread Eagle — via Denkmal.org.",
    venueName: "sunbeach",
    tags: ["hard rock"],
    date: "2026-09-06",
    startTime: "2026-09-06T20:00:00+02:00",
    infoUrl: "https://sunbea.ch/lokalitaeten/",
  },
  {
    title: "Florias",
    description: "Florias — via Denkmal.org.",
    venueName: "Das Viertel",
    tags: ["folk"],
    date: "2026-09-09",
    startTime: "2026-09-09T20:00:00+02:00",
    infoUrl: "https://www.facebook.com/vierteldachbasel",
  },
];

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

  const byName = (name: string) => {
    const venue = venueRecords.find((v) => v.name === name);
    if (!venue) throw new Error(`Seed event references unknown venue "${name}"`);
    return venue;
  };

  const allTagNames = new Set<string>();
  for (const e of [...relativeSampleEvents, ...absoluteSampleEvents]) {
    for (const t of e.tags) allTagNames.add(t.toLowerCase());
  }

  const tagRecords: Record<string, { id: string }> = {};
  for (const name of allTagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tagRecords[name] = tag;
  }

  let created = 0;

  for (const e of relativeSampleEvents) {
    const date = daysFromNow(e.daysOut, 0);
    const startTime = daysFromNow(e.daysOut, e.startHour);
    const endTime =
      e.endHour < e.startHour
        ? daysFromNow(e.daysOut + 1, e.endHour)
        : daysFromNow(e.daysOut, e.endHour);
    const venue = byName(e.venueName);

    const existing = await prisma.event.findFirst({
      where: { title: e.title, venueId: venue.id },
    });
    if (existing) continue;

    await prisma.event.create({
      data: {
        title: e.title,
        description: e.description,
        date,
        startTime,
        endTime,
        venueId: venue.id,
        price: e.price ?? null,
        infoUrl: e.infoUrl ?? null,
        promoter: e.promoter ?? null,
        status: "approved",
        tags: {
          create: e.tags.map((t) => ({ tagId: tagRecords[t.toLowerCase()].id })),
        },
      },
    });
    created += 1;
  }

  for (const e of absoluteSampleEvents) {
    const startTime = new Date(e.startTime);
    const date = new Date(e.date);
    const endTime = e.endTime ? new Date(e.endTime) : null;
    const venue = byName(e.venueName);

    const existing = await prisma.event.findFirst({
      where: { title: e.title, venueId: venue.id },
    });
    if (existing) continue;

    await prisma.event.create({
      data: {
        title: e.title,
        description: e.description,
        date,
        startTime,
        endTime,
        venueId: venue.id,
        price: e.price ?? null,
        infoUrl: e.infoUrl ?? null,
        promoter: e.promoter ?? null,
        status: "approved",
        tags: {
          create: e.tags.map((t) => ({ tagId: tagRecords[t.toLowerCase()].id })),
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
