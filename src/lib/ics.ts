import { createEvent, createEvents, type DateArray, type EventAttributes } from "ics";

type IcsEventInput = {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  infoUrl: string | null;
  venue: { name: string; address: string };
};

function toDateArray(d: Date): DateArray {
  return [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
  ];
}

function toAttributes(event: IcsEventInput): EventAttributes {
  const end = event.endTime ?? new Date(event.startTime.getTime() + 2 * 60 * 60 * 1000);
  return {
    uid: `${event.id}@baselmusic`,
    title: event.title,
    description: event.description,
    location: `${event.venue.name}, ${event.venue.address}`,
    url: event.infoUrl ?? undefined,
    start: toDateArray(event.startTime),
    end: toDateArray(end),
    productId: "baselmusic/ics",
  };
}

export function buildSingleEventIcs(event: IcsEventInput): string {
  const { error, value } = createEvent(toAttributes(event));
  if (error || !value) throw error ?? new Error("Failed to build .ics file");
  return value;
}

export function buildFeedIcs(events: IcsEventInput[]): string {
  const { error, value } = createEvents(events.map(toAttributes));
  if (error || !value) throw error ?? new Error("Failed to build .ics feed");
  return value;
}
