<script lang="ts">
	import { page } from '$app/stores';
	import { exclaim } from '$lib/components/Toast/toast';
	import { onMount } from 'svelte';
	import { MapPin, CalendarCheck2, Ticket  } from 'lucide-svelte';
	import { marked } from 'marked';

	const event = $page.data.event;
	const user = $page.data.session?.user;
	const userId = $page.data.session?.user?.id;
	const team = $page.data.teams ?? null;
	const teamMembers = team?.user ?? null;
	const leaderId = $page.data.leaderId;
	let isLeader = false;

	onMount(() => {
		if (leaderId == userId) {
			isLeader = true;
		}
	});

	function formatDate(dateString: string | number | Date) {
		const date = new Date(dateString);

		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function copyToClipboard(text: string) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				exclaim('Copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}
	const deleteTeamMember = async (id: string) => {
		const response = await fetch('/api/eventRegistration', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				teamId: team.id,
				userId: id
			})
		});
		const res = await response.json();
		if (res.success) {
			exclaim('Deleted team member');
			window.location.reload();
		}
	};
</script>

<!-- And in the upcoming page or the event slug page, the team members display, team leader highlight delete members, leave button etc -->

<div class="grid-cols-9 p-3 sm:p-10 lg:grid">
	<div class="custom-padding col-span-4 h-full p-10 lg:p-16">
		<img src={event.image} alt="" class="h-full rounded-xl object-contain" />
	</div>
	<div class="col-span-5 py-10 lg:pr-10">
		<p class="text-6xl font-bold max-lg:text-center max-sm:text-4xl">{event.title}</p>
		<br />

		<div class="w-full p-4 lg:max-h-[25rem] lg:overflow-y-auto">
			{@html marked(event.description)}
		</div>
		<br />

		<div class="flex flex-col md:flex-row justify-center gap-2 px-8 sm:flex-row sm:p-0">
			{#if event.venue}
				<div class="tex-white flex basis-1/3 flex-nowrap place-content-center items-center gap-4 rounded-lg border-2 border-slate-500 p-2 py-4 text-xl font-semibold">
					<MapPin class="stroke-red-500" />
					<p>{event.venue}</p>
				</div>
			{/if}

			{#if event.entryFee}
				<div class="tex-white flex basis-1/3 flex-nowrap place-content-center items-center gap-4 rounded-lg border-2 border-slate-500 p-2 py-4 text-xl font-semibold">
					<Ticket class="stroke-orange-400"/>
					<p>Entry Fee : {event.entryFee ? "₹"+event.entryFee : "Free"}</p>
				</div>
			{/if}

			{#if event.date}
				<div class="tex-white flex basis-1/3 flex-nowrap justify-center items-center gap-4 rounded-lg border-2 border-slate-500 p-2 py-4 text-xl font-semibold">
					<CalendarCheck2 class="stroke-blue-600"/>
					<div>
						<p>{formatDate(event.date)}</p>
						<p>{event.time}</p>
					</div>
				</div>
			{/if}
		</div>
		<div class="mt-5 flex items-center">
			{#if team}
				<button class="rounded-xl bg-gray-500 px-5 py-3 text-2xl text-white max-lg:mx-auto max-sm:text-xl" disabled> Registered </button>
			{:else}
				<a href={`/events/register/${event.id}`}>
					<button class="rounded-xl bg-brand px-5 py-3 text-2xl text-white duration-200 hover:scale-110 max-sm:text-xl"> Register Now </button>
				</a>
			{/if}
		</div>
	</div>
</div>

<div class="px-3">
	{#if event.type == 'TEAM' && team}
		<div class="m-auto mb-10 w-fit rounded-lg bg-[rgba(255,255,255,0.27)] p-3">
			<p class="text-center text-3xl font-bold max-sm:text-2xl">Team Details</p>
			<hr class="m-2 border-white" />
			<p class="text-xl font-bold max-sm:text-lg">Team Name : {team.name}</p>
			<p class="text-xl max-sm:text-lg">
				Team id : {team.id}
				<button on:click={() => copyToClipboard(team.id)} class="ml-2"
					><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2" /><path fill="white" d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z" /></svg></button
				>
			</p>
			<br />
			<p class="text-center text-2xl font-bold max-sm:text-xl">Team members :</p>
			{#each teamMembers as member}
				<div class="my-2 flex justify-center border border-white py-2 text-center text-xl max-sm:text-lg">
					<img src={member.image} alt="profile-img" class="mx-2 my-auto h-10 w-10 rounded-full" />
					<p class="flex justify-center">
						{member.displayName}
						{#if member.id == leaderId}
							<span class="mx-2 h-1 w-1">
								<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
								<svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
									<polygon
										style="fill:#FFEA8A;"
										points="0,443.733 0,68.267 17.067,68.267 136.533,187.733 256,68.267 375.467,187.733 
	494.933,68.267 512,68.267 512,443.733 "
									/>
									<polygon
										style="fill:#FFDB2D;"
										points="494.933,68.267 375.467,187.733 256.002,68.267 256,68.267 256,443.733 512,443.733 
	512,68.267 "
									/>
								</svg>
							</span>
						{:else if isLeader}
							<button class="mx-2 my-auto h-fit w-fit rounded-md bg-red-600 p-1 text-sm" on:click={() => deleteTeamMember(member.id)}>Remove</button>
						{:else if member.id != userId}
							<button class="mx-2 my-auto h-fit w-fit rounded-md bg-red-600 p-1 text-sm" on:click={() => deleteTeamMember(member.id)}>Leave</button>
						{/if}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.custom-padding {
		@media (min-width: 1024px) and (max-width: 1350px) {
			padding-top: 120px;
			padding-bottom: 120px;
			padding-left: 30px;
			padding-right: 30px;
		}
	}

	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-thumb {
		background-color: #4b5563;
		border-radius: 10px;
	}
</style>
