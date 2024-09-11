import { db } from "$lib/db/db";
import { ServerLoad } from "@sveltejs/kit";

export const load = (async ({ params }) => {
    const event = await db.event.findUnique({
        where: { id: params.eventId },
        include: { participants: true }
    })

    return { event: event };
}) satisfies ServerLoad;