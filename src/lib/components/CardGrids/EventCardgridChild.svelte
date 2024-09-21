<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth/stores';
	import Input from '$lib/components/ui/input/input.svelte';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog-publications';
	import { exclaim, failure, success } from '$lib/components/Toast/toast';

	export let event;
	export let eventType: string;

	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	};
	let registered: boolean = false;
	let teamName = '';
	let teamId = '';

	onMount(async () => {
		if (eventType === 'upcoming' && $user) {
			const response = await fetch(`/api/eventRegistration?eventId=${event.id}&studentId=${$user.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			teamName = data.registration.name;
			teamId = data.registration.id;

			registered = data.isExists;
		}
	});

	const copyToClipboard = () => {
		if (teamName && teamId) {
			navigator.clipboard
				.writeText(teamId)
				.then(() => {
					exclaim('Team ID copied to clipboard');
				})
				.catch(() => {
					failure('Failed to copy Team ID to clipboard');
				});
		}
	};
</script>

{#if eventType === 'upcoming'}
	<div class="m-5 flex h-full w-full flex-col">
		<div class="dark:custom-shadow-black bg-muted-light dark:bg-muted-dark e m-auto w-full rounded-lg bg-[rgba(110,119,160,0.09)] px-5 py-6 shadow-xl backdrop-blur-sm dark:drop-shadow-md md:flex">
			<div class=" justify-center">
				{#if event.image}
					<img src={event?.image} alt={event.title} class=" m-auto h-72 w-72 object-contain" />
				{/if}
			</div>
			<div class="w-full px-10 text-lg h-full">
				<h1 class="mb-5 text-center text-5xl font-bold">{event.title}</h1>
				<div class="flex-col m-autoo">
					<p class=""><span class="font-bold">Description: </span>{event.brief}</p>
					{#if event.date}
						<h2 class="mt-1">Date: {event.date.toLocaleDateString(undefined, options)}</h2>
					{/if}
					{#if event.time}
						<h2 class="mt-1">Time: {event.time}</h2>
					{/if}
					{#if event.venue}
						<h2 class="mt-1">Venue: {event?.venue}</h2>
					{/if}
					{#if registered}
						<p class="mt-3 text-center text-green-400">You have already registered for the event</p>
					{/if}
				</div>
				<div class="flex justify-center space-x-2 pt-4">
					<button class="rounded-md bg-brand px-3 py-1 text-white hover:scale-110 transition" on:click={()=>goto(`/events/upcoming/${event.id}`)}>View Details</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full w-full flex-col">
		<div class="dark:custom-shadow-black bg-muted-light dark:bg-muted-dark m-auto flex-1 rounded-lg px-5 py-8 shadow-xl dark:drop-shadow-md">
			<div class="flex justify-center">
				{#if event.image}
					<img src={event?.image} alt={event.title} class="border-muted-light dark:border-muted-dark m-auto border object-cover" />
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