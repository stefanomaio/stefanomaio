"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, verifySessionToken, MODERATION_COOKIE } from "@/lib/auth";
import { seedDatabase } from "@/lib/seedData";

export type LoginState = { status: "idle" | "error"; message?: string };

async function requireAuth() {
  const jar = await cookies();
  const token = jar.get(MODERATION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    throw new Error("Not authenticated");
  }
}

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");
  const correct = process.env.MODERATION_PASSWORD;

  if (!correct) {
    return {
      status: "error",
      message:
        "No MODERATION_PASSWORD is configured on the server. Set it in your environment to enable moderation.",
    };
  }
  if (typeof password !== "string" || password !== correct) {
    return { status: "error", message: "Incorrect password." };
  }

  const jar = await cookies();
  jar.set(MODERATION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/moderate",
    maxAge: 60 * 60 * 12,
  });
  redirect("/moderate");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(MODERATION_COOKIE);
  redirect("/moderate");
}

export async function approveEvent(id: string) {
  await requireAuth();
  const event = await prisma.event.findUniqueOrThrow({
    where: { id },
    select: { venueId: true },
  });
  await prisma.$transaction([
    prisma.event.update({ where: { id }, data: { status: "approved" } }),
    // If this event introduced a brand-new venue, approving the event
    // approves the venue too — its name/address were already shown
    // inline on the pending card, so this doesn't skip review.
    prisma.venue.updateMany({
      where: { id: event.venueId, status: "pending" },
      data: { status: "approved" },
    }),
  ]);
  revalidatePath("/moderate");
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath("/submit");
}

export async function rejectEvent(id: string) {
  await requireAuth();
  const event = await prisma.event.findUniqueOrThrow({
    where: { id },
    select: { venueId: true },
  });
  await prisma.$transaction([
    prisma.event.update({ where: { id }, data: { status: "rejected" } }),
    prisma.venue.updateMany({
      where: { id: event.venueId, status: "pending" },
      data: { status: "rejected" },
    }),
  ]);
  revalidatePath("/moderate");
}

export async function seedSampleData() {
  await requireAuth();
  const result = await seedDatabase(prisma);
  revalidatePath("/moderate");
  revalidatePath("/");
  revalidatePath("/map");
  return result;
}

const editSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(4000),
  venueId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  price: z.string().trim().max(100).optional(),
  infoUrl: z.string().trim().url().optional().or(z.literal("")),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  promoter: z.string().trim().max(200).optional(),
  tags: z.string().trim().max(300).optional(),
});

export type EditState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function combineDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export async function updateEvent(
  id: string,
  _prevState: EditState,
  formData: FormData,
): Promise<EditState> {
  await requireAuth();

  const raw = Object.fromEntries(formData.entries());
  const parsed = editSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
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

  await prisma.event.update({
    where: { id },
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
      tags: {
        deleteMany: {},
        create: tagRecords.map((t) => ({ tagId: t.id })),
      },
    },
  });

  revalidatePath("/moderate");
  revalidatePath("/");
  revalidatePath(`/events/${id}`);

  return { status: "success", message: "Saved." };
}
