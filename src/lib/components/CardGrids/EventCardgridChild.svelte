<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/auth/stores";
	import { P } from "flowbite-svelte";
	import { onMount } from "svelte";
	export let event;
	export let eventType: string;

	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	};
	let registered: boolean = false;

	onMount(async() => {
		if(eventType === 'upcoming' && $user) {
			const response = await fetch(`/api/eventRegistration?eventId=${event.id}&studentId=${$user.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();

			registered = data.isExists;
		}
	})
</script>

{#if eventType === 'upcoming'}
	<div class="w-full h-full flex-col px-4">
		<div class="flex space-x-10 bg-muted-light dark:bg-muted-dark flex-1 rounded-lg">
			<div class="flex justify-center w-1/3">
				{#if event.image}
					<img src={event?.image} alt={event.title} class="border-muted-light dark:border-muted-dark border object-cover m-auto" />
				{/if}
			</div>
			<div class="w-2/3">
				<h1 class="py-4 mb-10 lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold gradient-text">{event.title}</h1>
				<div class="flex flex-col place-content-evenly ">
					{#if event.date}
						<div class="lg:text-2xl md:text-xl sm:text-lg text-md mb-6">Date: {event.date.toLocaleDateString(undefined, options)}</div>
					{/if}
					{#if event.time}
						<div class="lg:text-2xl md:text-xl sm:text-lg text-md mb-6">Time: {event.time}</div>
					{/if}
					{#if event.venue}
						<div class="lg:text-2xl md:text-xl sm:text-lg text-md mb-6">Venue: {event?.venue}</div>
					{/if}
				</div>
			</div>
		</div>
		<div>
			<h1 class="py-4 mb-2 lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">Description</h1>
			<p class="lg:text-2xl md:text-xl sm:text-lg text-md">{event.description}</p>
		</div>
		{#if registered}
			<p>You have already registered for the event</p>
		{:else}
			<button on:click={() => goto(`/events/register/${event.id}`)}>Register</button>
		{/if}
	</div>
{:else}
	<div class="flex w-full h-full flex-col">
		<div class="dark:custom-shadow-black bg-muted-light dark:bg-muted-dark flex-1 rounded-lg px-5 py-8 shadow-xl dark:drop-shadow-md m-auto">
			<div class="flex justify-center">
				{#if event.image}
					<img src={event?.image} alt={event.title} class="border-muted-light dark:border-muted-dark border object-cover m-auto" />
				{/if}
			</div>
			<h1 class="py-4 text-center text-2xl font-bold">{event.title}</h1>
			{#if event.date}
				<h2 class="text-center text-xl">Date: {event.date.toLocaleDateString(undefined, options)}</h2>
			{/if}
			{#if event.time}
				<h2 class="text-center text-xl">Time: {event.time}</h2>
			{/if}
			{#if event.venue}
				<h2 class="text-center text-xl">Venue: {event?.venue}</h2>
			{/if}

			<div class="flex items-center justify-center pt-4">
				<!-- {#if event.registrationLink}
						<a href={event.registrationLink} target="_blank">
							<button class="rounded-xl bg-brand px-4 py-2 text-white duration-200 hover:scale-110"> Register Now </button>
						</a>
					{/if} -->
				<!-- <button class="rounded-xl bg-brand px-4 py-2 text-white">Registration Closed! Spot Registrations are Available</button> -->
			</div>
		</div>
	</div>
{/if}

<style>
	.gradient-text {
		background: linear-gradient(180deg, #ffffff, rgb(130, 131, 137));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

</style>