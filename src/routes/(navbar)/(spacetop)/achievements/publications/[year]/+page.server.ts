import { db } from "$lib/db/db";

export const load = async ({ params }) => {
    const { year } = params;
    const publications = await db.publication.findMany({
        where: { year: { year: year } },
        orderBy: { month_year: "desc" },
        select: {
            id: true,
            name:true,
            designation: true,
            title: true,
            authors: true,
            journal: true,
            conference: true,
            month_year: true,
            ranking: true,
            impact_factor: true,
            publisher: true,
            indexed: true,
            publisher_conference: true,
            link: true
        }
    });
    return { body: { publications } };
};