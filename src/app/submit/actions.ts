"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const submitSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(200),
  description: z.string().trim().min(10, "Add a bit more description").max(4000),
  venueId: z.string().min(1, "Pick a venue"),
  date: z.string().min(1, "Pick a date"),
  startTime: z.string().min(1, "Pick a start time"),
  endTime: z.string().optional(),
  price: z.string().trim().max(100).optional(),
  infoUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  promoter: z.string().trim().max(200).optional(),
  tags: z.string().trim().max(300).optional(),
  submittedByName: z.string().trim().min(1, "Your name is required").max(200),
  submittedByEmail: z.string().trim().email("Must be a valid email"),
});

export type SubmitFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function combineDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export async function submitEvent(
  _prevState: SubmitFormState,
  formData: FormData,
): Promise<SubmitFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = submitSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const date = combineDateTime(data.date, data.startTime);
  const startTime = combineDateTime(data.date, data.startTime);
  let endTime = data.endTime ? combineDateTime(data.date, data.endTime) : null;
  if (endTime && endTime <= startTime) {
    endTime = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
  }

  const tagNames = (data.tags ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  const tagRecords = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );

  await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      venueId: data.venueId,
      date,
      startTime,
      endTime,
      price: data.price || null,
      infoUrl: data.infoUrl || null,
      imageUrl: data.imageUrl || null,
      promoter: data.promoter || null,
      status: "pending",
      submittedByName: data.submittedByName,
      submittedByEmail: data.submittedByEmail,
      tags: { create: tagRecords.map((t) => ({ tagId: t.id })) },
    },
  });

  return {
    status: "success",
    message:
      "Thanks! Your event has been submitted and will appear once it's approved.",
  };
}
