import { db } from '$lib/db/db.js';

export async function load({ url}) {
    const eventId = url.pathname.split('/').filter(Boolean)[2];

    const participants = await db.event.findFirst({
        where:{
            id: eventId
        },
        select:{
            participants: {
                select: {
                    id: true,
                    name: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                            username: true,
                            phone: true
                        }
                    },
                    attended: true
                }
            },
            winners: {
                select: {
                    id: true,
                    position: true,
                    teamId: true,
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    })

    return {
        adminData: {
            participants: participants,
        }
    }
}   