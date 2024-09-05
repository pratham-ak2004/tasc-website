<script lang="ts">
	import type { Publication } from '$lib/components/types/AchievementData';
	import { NAME_TO_IMAGE as images } from '$lib/data/Images';
	import * as Dialog from '$lib/components/ui/dialog-publications';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';

	export let publicationss;

	let publications = publicationss;
	export let faculty: Record<string, string[]>;
	export let titles: Record<string, Publication[]>;
	// console.log(publications);

	gsap.registerPlugin(ScrollTrigger);

	let facultyNames = Object.keys(faculty);

	function title_details(key: string, value: string) {
		if (value === '') return '';
		let detail = `
            <div class="grid sm:grid-cols-8 grid-cols-9 items-center">
                <p class="sm:col-auto col-span-2">${key}</p>
                <p class="text-center">:</p>
                <p class="sm:col-span-6 col-span-5">${value}</p>
            </div>`;
		return detail;
	}

	let groupedPublications: Record<string | number, { designation: string,link:string, publications: Publication[] }> = {};
	publications.forEach((publication: Publication) => {
		if (!groupedPublications[publication.name]) {
			groupedPublications[publication.name] = {
				designation: publication.designation,
                link:publication.link,
				publications: []
			};
		}
		groupedPublications[publication.name].publications.push(publication);
	});

	onMount(() => {
		const items = document.querySelectorAll('.animate-item');
		items.forEach((item) => {
			gsap.fromTo(
				item,
				{ x: -200, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 1.5,
					ease: 'power4.out',
					scrollTrigger: {
						trigger: item,
						start: 'top 90%', // Starts animation when the top of the element is at 80% of the viewport height
						end: 'bottom 60%', // Ends animation when the bottom of the element is at 70% of the viewport height
						scrub: true,
						toggleActions: 'play none none reverse',
						markers: false // Set to true to see markers for debugging
					}
				}
			);
		});
	});
</script>

<div class="flex flex-col gap-6 px-4 sm:px-0 md:px-12 lg:px-24">
	{#each facultyNames as teacher}
		<div class="animate-item flex grid-cols-10 flex-col justify-items-center gap-3 rounded-2xl border border-blue-500 bg-card p-2 opacity-0 sm:grid sm:gap-0 sm:p-3 md:p-4 lg:p-5">
			<div class="relative col-span-2 grid place-content-center justify-items-center transition duration-300 ease-in-out">
				<div class="image-container"><img src={images.find((n) => n.name === teacher)?.image || ''} alt="" class="aspect-[3/4] w-40 rounded-2xl sm:w-auto sm:object-cover" /></div>
				<div class="hover:dark:custom-drop-shadow-white hover:custom-drop-shadow-black absolute inset-0 grid items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 dark:text-white">
					<!-- <p class="justify-self-center lg:text-xl md:text-lg sm:text-md">{teacher}</p> -->
					<p class="sm:text-md justify-self-center md:text-lg lg:text-xl">{publications[0].name}</p>
					<!-- <p class="justify-self-center lg:text-lg md:text-md sm:text-sm">({designation})</p> -->
					<p class="sm:text-md justify-self-center md:text-lg lg:text-xl">{publications[0].designation}</p>
				</div>
			</div>
			<div class="col-span-8 flex flex-col justify-evenly gap-5 sm:w-[80%]">
				{#each faculty[teacher] as paper}
					<Dialog.Root>
						<Dialog.Trigger>
							<h1 class="animate-item md:text-md text-center text-xs font-semibold hover:cursor-pointer hover:underline sm:text-sm lg:text-lg">{paper}</h1>
						</Dialog.Trigger>
						<Dialog.Content>
							<div class="grid justify-around gap-6">
								{@html title_details('Title', `${paper} (<a href=${titles[paper][0].link} class="text-blue-500 hover:underline">Read the full paper here</a>)`)}
								{@html title_details('Authors', titles[paper][0].authors.map((author) => author).join(', '))}
								{@html title_details('Date of Publication', titles[paper][0].month_year)}
								{#if titles[paper][0].journal !== ''}
									{@html title_details('Journal', `${titles[paper][0].journal}${titles[paper][0].ranking ? `(${titles[paper][0].ranking})` : ''}`)}
								{:else}
									{@html title_details('Journal Ranking', titles[paper][0].ranking)}
								{/if}
								{@html title_details('Impact Factor', titles[paper][0].impact_factor)}
								{@html title_details('Publisher', titles[paper][0].publisher)}
								{@html title_details('Conference', titles[paper][0].conference)}
								{@html title_details('Publisher', titles[paper][0].publisher_conference)}
								{@html title_details('Indexing', `Indexed in ${titles[paper][0].indexed}`)}
							</div>
						</Dialog.Content>
					</Dialog.Root>
				{/each}
			</div>
		</div>
	{/each}
</div>

<!-- <div>
	{#each publications as publication}
		<div class="border border-white p-2 m-2">
			<p>{publication.name}</p>
			<p>{publication.title}</p>
			<p>{publication.designation}</p>
		</div>
	{/each}
</div> -->

<hr>
<p class="text-3xl text-center my-4">Fetching from db</p>

<div class="mx-10">
    {#each Object.keys(groupedPublications) as name}
        <div class="m-2 border border-white p-2 flex text-center">
            <div class="image-container">
                <img src={images.find((n) => n.name === name)?.image || ''} alt="" class="aspect-[3/4] w-40 rounded-2xl sm:w-auto sm:object-cover" />
            </div>
            <div class="w-full m-auto">
                <p class="text-xl my-2"><strong>{name} ({groupedPublications[name].designation})</strong></p>
                {#each groupedPublications[name].publications as publication}
                <p class="hover:underline m-2"><a href={publication.link}>{publication.title}</a></p>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
	.image-container {
		opacity: 1;
		transition: opacity 0.3s ease-in-out;
	}

	.relative:hover .image-container {
		opacity: 0.5;
	}
</style>
