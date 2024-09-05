<script lang="ts">
    import { PUBLICATION_DETAILS } from "$lib/data/Achievements";
    import type { Publication, PublicationDetails } from "$lib/components/types/AchievementData";
    import PublicationCard from '$lib/components/Card/PublicationCard.svelte';
    export let year: string;
    export let publicationss;

    let publications: Publication[] = PUBLICATION_DETAILS.find((publication: PublicationDetails) => publication.year === year)?.publications || [];
    
    let publicationsByTitle: Record<string, Publication[]> = {};
    let publicationsByFaculty: Record<string, string[]> = {};

    publications.forEach((publication: Publication) => {
        if (!publicationsByTitle[publication.title]) publicationsByTitle[publication.title] = [];
        publicationsByTitle[publication.title].push(publication);

        if (!publicationsByFaculty[publication.name]) publicationsByFaculty[publication.name] = [];
        publicationsByFaculty[publication.name].push(publication.title);
    });
</script>

<div class="px-4 md:py-5 py-0">
    <PublicationCard faculty={publicationsByFaculty} titles={publicationsByTitle} publications={publications} publicationss={publicationss}/>
</div>