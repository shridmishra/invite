"use server"

import { db } from "@/lib/db"
import { invite } from "@/lib/schema"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function createInvite(data: {
    recipientName: string;
    message?: string;
    reason1?: string;
    reason2?: string;
    theme?: string;
    slug?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const id = nanoid()
    // If slug is provided, use it, otherwise use ID (or handle slug uniqueness)
    const slug = data.slug || id;

    // Check if slug exists if custom slug logic was implemented (omitted for now for simplicity)
    
    await db.insert(invite).values({
        id,
        userId: session.user.id,
        slug: slug,
        recipientName: data.recipientName,
        message: data.message,
        reason1: data.reason1,
        reason2: data.reason2,
        theme: data.theme || "pink",
    })

    return { success: true, id, slug }
}

export async function getInvite(slug: string) {
    const result = await db.select().from(invite).where(eq(invite.slug, slug))
    return result[0] || null
}

export async function updateInvite(id: string, data: {
    recipientName: string;
    message?: string;
    reason1?: string;
    reason2?: string;
    theme?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const currentInvite = await db.select().from(invite).where(eq(invite.id, id));
    
    if (currentInvite.length === 0) {
        throw new Error("Invite not found")
    }

    if (currentInvite[0].userId !== session.user.id) {
        throw new Error("Unauthorized: You are not the owner of this invite")
    }

    await db.update(invite)
        .set({
            recipientName: data.recipientName,
            message: data.message,
            reason1: data.reason1,
            reason2: data.reason2,
            theme: data.theme,
            updatedAt: new Date(),
        })
        .where(eq(invite.id, id));

    return { success: true }
}

export async function getUserInvites() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return []
    }

    return await db.select().from(invite).where(eq(invite.userId, session.user.id))
}

export async function getInviteById(id: string) {
    const result = await db.select().from(invite).where(eq(invite.id, id))
    return result[0] || null
}
