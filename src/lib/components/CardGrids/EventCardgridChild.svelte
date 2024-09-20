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
					<!-- {#if !registered}
						<button on:click={() => goto(/events/register/${event.id})} class="rounded-md bg-[rgb(207,85,247)] px-3 py-1">Register</button>
					{/if} -->
					<!-- <Dialog.Root>
						<Dialog.Trigger class="rounded-md bg-[rgb(207,85,247)] px-3 py-1">							View Details
						</Dialog.Trigger>
						<Dialog.Content class="w-full overflow-y-scroll md:w-2/3">
							<div class="grid justify-around">
								<div class="relative flex flex-col md:flex-row">
									{#if event.image}
										<img src={event?.image} alt={event.title} class="border-muted-light dark:border-muted-dark m-auto h-auto w-auto border object-cover md:w-1/2" />
									{/if}
									<div class="text-nowrap mx-3 flex flex-col">
										<h1 class="pb-2 text-2xl font-bold sm:pb-12 md:text-3xl">{event.title}</h1>
										<div class="grid h-full sm:justify-around">
											{#if event.date}
												<h2 class="sm:text-md text-sm md:text-lg lg:text-xl"><span class="font-bold">Date:</span> {event.date.toLocaleDateString(undefined, options)}</h2>
											{/if}
											{#if event.time}
												<h2 class="sm:text-md text-sm md:text-lg lg:text-xl"><span class="font-bold">Time:</span> {event.time}</h2>
											{/if}
											{#if event.venue}
												<h2 class="sm:text-md text-sm md:text-lg lg:text-xl"><span class="font-bold">Venue:</span> {event?.venue}</h2>
											{/if}
										</div>
									</div>
								</div>
								<br />
								<hr class="w-full border-b border-white" />
								<br />
								<div>
									<h1 class="text-2xl font-bold sm:text-3xl">Description</h1>
									<br />
									<p class="text-md">
										{@html marked(event.description)}
									</p>
									<br />
									{#if teamName}
										<br />
										<p class="text-xl">Team Name: {teamName}</p>
										<div class="flex flex-row flex-nowrap">
											<p class="text-nowrap text-xl">Team ID:</p>
											<Input type="text" readonly value={teamId} />
											<button on:click={copyToClipboard} class="ml-2"
												><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
													><path fill="white" d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2" /><path fill="white" d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z" /></svg
												></button
											>
										</div>
										<p>Ask your friends to join your team using this team id</p>
									{/if}
									<br />
								</div>
							</div>
						</Dialog.Content>
					</Dialog.Root> -->
					<button class="rounded-md bg-brand px-3 py-1 hover:scale-110 transition" on:click={()=>goto(`/events/upcoming/${event.id}`)}>View Details</button>
					<!-- bg-[rgb(207,85,247)] -->
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