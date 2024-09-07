<script lang="ts">
	// import { PATENT_DETAILS } from '$lib/data/Achievements';
	import type { Patent, PatentDetails } from '$lib/components/types/AchievementData';
	import PatentCard from '$lib/components/Card/PatentCard.svelte';
	export let year: string;

    import { main } from '$lib/data/Patents';

    let patents:Patent[] = main(year);

	// let patents: Patent[] = PATENT_DETAILS.find((patent: PatentDetails) => patent.year === year)?.patents || [];
	// console.log(PATENT_DETAILS);
    //console.log(patents)
</script>

<div class="py-0 sm:px-4 md:py-5">
	<PatentCard {patents} />
</div>
