// import { db } from '$lib/firebase/firebase';
// import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/db/db';
import type EventData from '$lib/types/EventData';
import { ServerLoad } from '@sveltejs/kit';

// @ts-ignore
export const load = (async ({ params }) => {
	const eventSnapshot = await db.event.groupBy({
		by: ['id', 'title', 'description', 'date', 'time', 'image', 'reportLink', 'venue', 'category'],
		orderBy: { date: params.type === 'upcoming' ? 'asc' : 'desc' },
		where: { published: true, category: params.type }
	})
	
	const events: EventData[] = [];

	eventSnapshot.forEach(event => {
		events.push({
			id: event.id,
			title: event.title,
			image: event.image,
			date: event.date,
			time: event.time,
			venue: event.venue,
			description: event.description,
			guests: [],
			reportLink: event.reportLink
		});
	});
	return { events: events };
}) satisfies ServerLoad;
