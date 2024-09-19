import { db } from '$lib/db/db';
import { user } from '$lib/auth/stores';

// export const load = async({params})=>{
//     const eventId=params.eventId;
//     const event=await db.event.findUnique({
//         where:{
//             id:eventId
//         }
//     })

//     return ({event:event})
// }

export const load = async (event) => {
	const session = await event.locals.auth();
	const id = session?.user?.id;
	let teams;
	let leaderId;

	const eventId = event.url.pathname.split('/')[3];

	const eventDetail = await db.event.findUnique({
		where: {
			id: eventId
		}
	});

	
	if (id) {
		teams = await db.team.findMany({
			where: {
				user: {
					some: {
						id: id
					}
				}
			},
			select: {
				id: true,
				name: true,
				user: true,
				event: true,
				attended: true,
				leaderId:true,
			}
		});
		teams = teams?.at(0);
		leaderId=teams?.leaderId
		return {
			teams: teams,
			event: eventDetail,
			leaderId:leaderId
		};
	}

	return {
		event: eventDetail
	};
};
