<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth/stores';
	import { P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let event;
	export let eventType: string;
	import * as Dialog from '$lib/components/ui/dialog-publications';
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
			console.log(data.registration.name, data.registration.id);
			teamName = data.registration.name;
			teamId = data.registration.id;

			registered = data.isExists;
		}
	});
</script>

{#if eventType === 'upcoming'}
	<div class="flex h-full w-full flex-col">
		<div class="dark:custom-shadow-black bg-muted-light dark:bg-muted-dark m-auto flex-1 rounded-lg px-5 py-6 shadow-xl dark:drop-shadow-md">
			<div class="flex justify-center">
				{#if event.image}
					<img src={event?.image} alt={event.title} class="border-muted-light dark:border-muted-dark m-auto border object-cover" />
				{/if}
			</div>
			<div>
				<h1 class="py-4 text-center text-2xl font-bold">{event.title}</h1>
				{#if event.date}
					<h2 class="text-center text-lg">Date: {event.date.toLocaleDateString(undefined, options)}</h2>
				{/if}
				{#if event.time}
					<h2 class="text-center text-lg">Time: {event.time}</h2>
				{/if}
				{#if event.venue}
					<h2 class="text-center text-lg">Venue: {event?.venue}</h2>
				{/if}
			</div>
			<!-- <hr class="my-2 border-b border-white" /> -->
			<!-- <div>
				<h1 class="text-center text-xl font-bold">Description</h1>
				<p class="text-md text-center">{event.description}</p>
			</div> -->
			{#if registered}
				<p class="mt-3 text-center text-green-400">You have already registered for the event</p>
				<div class="flex justify-center pt-4">
					<Dialog.Root>
						<Dialog.Trigger class="rounded-md bg-[rgb(207,85,247)] px-3 py-1">
							<!-- <h1 class=" md:text-md text-center text-xs font-semibold hover:cursor-pointer hover:underline sm:text-sm lg:text-lg">{paper.title}</h1> -->
							View Details
						</Dialog.Trigger>
						<Dialog.Content>
							<div class="grid justify-around gap-6">
								<h1 class="py-4 text-center text-2xl font-bold">{event.title}</h1>
								<hr class="w-full border-b border-white" />
								<div>
									<h1 class="text-xl font-bold">Description</h1>
									<p class="text-md">{event.description}</p>
									{#if teamName}
										<p class="text-md ">Team Name : {teamName}</p>
										<p class="text-md ">Team Id : {teamId}</p>
									{/if}
								</div>
							</div>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			{:else}
				<div class="flex justify-center space-x-2 pt-4">
					<button on:click={() => goto(`/events/register/${event.id}`)} class="rounded-md bg-[rgb(207,85,247)] px-3 py-1">Register</button>
					<Dialog.Root>
						<Dialog.Trigger class="rounded-md bg-[rgb(207,85,247)] px-3 py-1">
							<!-- <h1 class=" md:text-md text-center text-xs font-semibold hover:cursor-pointer hover:underline sm:text-sm lg:text-lg">{paper.title}</h1> -->
							View Details
						</Dialog.Trigger>
						<Dialog.Content>
							<div class="grid justify-around gap-6">
								<h1 class="py-4 text-center text-2xl font-bold">{event.title}</h1>
								<hr class="w-full border-b border-white" />
								<div>
									<h1 class="text-center text-xl font-bold">Description</h1>
									<p class="text-md text-center">{event.description}</p>
								</div>
							</div>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			{/if}
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
