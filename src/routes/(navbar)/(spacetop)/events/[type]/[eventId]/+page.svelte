<script lang="ts">
	import { page } from '$app/stores';
	import { exclaim } from '$lib/components/Toast/toast';
	import { onMount } from 'svelte';
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
	// console.log(teamMembers)
	// import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

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
		<img src={event.image} alt="" class="h-full" />
	</div>
	<div class="col-span-5 py-10 lg:pr-10">
		<p class="text-6xl font-bold max-lg:text-center max-sm:text-4xl">{event.title}</p>
		<br />
		<!-- <p class="text-3xl font-bold">Description</p> -->
		<!-- <ScrollArea class="h-[200px] w-[350px] rounded-md border p-4"> -->
		<!-- <p class="text-xl">{event.description}</p> -->
		<!-- </ScrollArea> -->
		<!-- <p class="text-3xl font-bold">Venue : </p> -->

		<div class="w-full p-4 lg:h-[350px] lg:overflow-y-auto">
			<p class="text-xl max-sm:text-base">{event.description}</p>
		</div>
		<br />
		<!-- <p class="text-3xl font-bold">Date and Time</p> -->
		<div class="flex items-center space-x-3 max-lg:justify-center max-sm:flex-col max-sm:space-y-3">
			<div class="flex h-full w-fit bg-[rgba(255,255,255,0.27)] p-2">
				<p class="w-fit text-xl font-bold">{event.venue}</p>
				<div class="m-auto h-10 w-10">
					<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 115.23"
						><defs
							><style>
								.cls-1 {
									fill: #212121;
								}
								.cls-1,
								.cls-2 {
									fill-rule: evenodd;
								}
								.cls-2 {
									fill: #f44336;
								}
							</style></defs
						><title>location</title><path class="cls-1" d="M25.32,75.31a3.59,3.59,0,1,1,0,7.18H18.58L9.7,108.07H112.93l-9.64-25.58H97.72a3.59,3.59,0,0,1,0-7.18h10.7l14.46,39.92H0L13.32,75.31Z" /><path class="cls-2" d="M79.06,83.64A70.16,70.16,0,0,1,63.78,96.28a2.15,2.15,0,0,1-2.45.08,86.21,86.21,0,0,1-21.25-19C32.34,67.69,27.46,56.92,25.8,46.55s-.11-20.63,5.12-28.86a35.35,35.35,0,0,1,7.91-8.76C46.21,3.05,54.64-.06,63,0A34.1,34.1,0,0,1,86,9.38a33.87,33.87,0,0,1,6.13,7.47c5.63,9.27,6.84,21.09,4.37,33.07a72.84,72.84,0,0,1-17.46,33.7v0ZM61.44,18.7A18.06,18.06,0,1,1,43.38,36.76,18.06,18.06,0,0,1,61.44,18.7Z" /></svg
					>
				</div>
			</div>

			{#if event.entryFee}
				<div class="flex h-full w-fit space-x-2 bg-[rgba(255,255,255,0.27)] p-2 text-xl max-sm:text-lg">
					<p>Entry Fee : ₹ {event.entryFee}</p>
				</div>
			{/if}

			<div class="flex w-fit space-x-2 bg-[rgba(255,255,255,0.27)] p-2 text-xl max-sm:text-lg">
				<div>
					<p>{formatDate(event.date)}</p>
					<p>{event.time}</p>
				</div>
				<div class="my-auto h-10 w-10">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001" xml:space="preserve"
						><path style="fill:#e2d7d3" d="M503.636 412.151 451.713 92.419v340.106h37.343c16.343.001 15.165-16.155 14.58-20.374z" /><path
							style="fill:#efe7e4"
							d="M438.7 79.405H21.102c-7.188 0-13.013 5.826-13.013 13.014v370.955c0 7.188 5.825 13.013 13.013 13.013H438.7c7.187 0 13.013-5.824 13.013-13.013V92.42c.001-7.187-5.827-13.015-13.013-13.015zM64.591 151.161c-11.543 0-20.903-9.358-20.903-20.902s9.36-20.904 20.903-20.904c11.544 0 20.904 9.36 20.904 20.904s-9.36 20.902-20.904 20.902zm65.38 0c-11.543 0-20.903-9.358-20.903-20.902s9.36-20.904 20.903-20.904c11.545 0 20.904 9.36 20.904 20.904s-9.359 20.902-20.904 20.902zm135.73-19.217c0 7.148-5.794 12.943-12.943 12.943h-56.98c-7.148 0-12.943-5.795-12.943-12.943v-3.373c0-7.148 5.795-12.943 12.943-12.943h56.98c7.149 0 12.943 5.795 12.943 12.943v3.373zm55.031 19.217c-11.544 0-20.904-9.358-20.904-20.902s9.36-20.904 20.904-20.904c11.543 0 20.904 9.36 20.904 20.904s-9.361 20.902-20.904 20.902zm65.381 0c-11.544 0-20.903-9.358-20.903-20.902s9.359-20.904 20.903-20.904 20.904 9.36 20.904 20.904-9.36 20.902-20.904 20.902z"
						/><path style="fill:#bab0a8" d="M451.714 92.42v340.106h25.381V248.715zM33.985 463.375V92.42c0-7.188 5.825-13.014 13.013-13.014H21.102c-7.188 0-13.013 5.826-13.013 13.014v370.955c0 7.188 5.825 13.013 13.013 13.013h25.896c-7.188 0-13.013-5.826-13.013-13.013z" /><path
							style="fill:#f44321"
							d="M438.7 79.405H21.102c-7.188 0-13.013 5.826-13.013 13.014v87.837H451.714V92.42c0-7.187-5.828-13.015-13.014-13.015zM64.591 151.161c-11.543 0-20.903-9.358-20.903-20.902s9.36-20.904 20.903-20.904c11.544 0 20.904 9.36 20.904 20.904s-9.36 20.902-20.904 20.902zm65.38 0c-11.543 0-20.903-9.358-20.903-20.902s9.36-20.904 20.903-20.904c11.545 0 20.904 9.36 20.904 20.904s-9.359 20.902-20.904 20.902zm135.73-19.217c0 7.148-5.794 12.943-12.943 12.943h-56.98c-7.148 0-12.943-5.795-12.943-12.943v-3.373c0-7.148 5.795-12.943 12.943-12.943h56.98c7.149 0 12.943 5.795 12.943 12.943v3.373zm55.031 19.217c-11.544 0-20.904-9.358-20.904-20.902s9.36-20.904 20.904-20.904c11.543 0 20.904 9.36 20.904 20.904s-9.361 20.902-20.904 20.902zm65.381 0c-11.544 0-20.903-9.358-20.903-20.902s9.359-20.904 20.903-20.904 20.904 9.36 20.904 20.904-9.36 20.902-20.904 20.902z"
						/><path style="fill:#d32d20" d="M33.985 92.42c0-7.188 5.825-13.014 13.013-13.014H21.102c-7.188 0-13.013 5.826-13.013 13.014v87.837h25.896V92.42z" /><path style="fill:#231f20" d="M438.7 484.477h-50.147a8.09 8.09 0 0 1 0-16.178H438.7a4.93 4.93 0 0 0 4.924-4.924V92.42a4.93 4.93 0 0 0-4.924-4.925H21.102a4.93 4.93 0 0 0-4.924 4.925v370.955a4.93 4.93 0 0 0 4.924 4.924h338.87a8.089 8.089 0 1 1 0 16.178H21.102C9.467 484.477 0 475.01 0 463.375V92.42c0-11.637 9.467-21.103 21.102-21.103H438.7c11.636 0 21.102 9.467 21.102 21.103v370.955c.001 11.635-9.466 21.102-21.102 21.102z" /><path
							style="fill:#231f20"
							d="M451.714 188.346h-63.162a8.089 8.089 0 1 1 0-16.178h55.072V92.42a4.93 4.93 0 0 0-4.924-4.925H21.102a4.93 4.93 0 0 0-4.924 4.925v79.748h343.794a8.089 8.089 0 1 1 0 16.178H8.089A8.088 8.088 0 0 1 0 180.257V92.42c0-11.637 9.467-21.103 21.102-21.103H438.7c11.636 0 21.102 9.467 21.102 21.103v87.837a8.087 8.087 0 0 1-8.088 8.089z"
						/><path style="fill:#231f20" d="M386.113 159.25c-15.986 0-28.992-13.005-28.992-28.991 0-15.987 13.007-28.993 28.992-28.993 15.987 0 28.993 13.007 28.993 28.993 0 15.986-13.006 28.991-28.993 28.991zm0-41.806c-7.066 0-12.814 5.749-12.814 12.815 0 7.065 5.748 12.812 12.814 12.812 7.067 0 12.815-5.748 12.815-12.812-.001-7.066-5.748-12.815-12.815-12.815z" /><path
							style="fill:#231f20"
							d="M397.251 141.027a8.2 8.2 0 0 1-1.405-.122c-18.037-3.159-31.129-26.927-31.129-56.514 0-31.888 15.452-56.868 35.178-56.868 17.661 0 31.935 19.495 34.713 47.409a8.09 8.09 0 0 1-7.249 8.85c-4.45.454-8.408-2.803-8.85-7.249-2.018-20.279-11.233-32.831-18.614-32.831-8.968 0-18.999 17.401-18.999 40.689 0 22.414 9.174 39.078 17.742 40.578a8.09 8.09 0 0 1-1.387 16.058zM320.732 159.25c-15.987 0-28.993-13.005-28.993-28.991 0-15.987 13.007-28.993 28.993-28.993s28.993 13.007 28.993 28.993c.001 15.986-13.006 28.991-28.993 28.991zm0-41.806c-7.067 0-12.815 5.749-12.815 12.815 0 7.065 5.748 12.812 12.815 12.812 7.067 0 12.815-5.748 12.815-12.812 0-7.066-5.748-12.815-12.815-12.815z"
						/><path style="fill:#231f20" d="M331.87 141.027c-.464 0-.932-.04-1.404-.122-18.038-3.159-31.129-26.927-31.129-56.514 0-31.888 15.452-56.868 35.178-56.868 17.662 0 31.936 19.495 34.713 47.409a8.09 8.09 0 0 1-7.25 8.85c-4.45.454-8.409-2.804-8.851-7.249-2.016-20.279-11.23-32.831-18.612-32.831-8.968 0-18.999 17.401-18.999 40.689 0 22.415 9.173 39.078 17.739 40.578a8.091 8.091 0 0 1 6.574 9.364c-.687 3.927-4.103 6.694-7.959 6.694zM129.971 159.25c-15.987 0-28.992-13.005-28.992-28.991 0-15.987 13.005-28.993 28.992-28.993s28.993 13.007 28.993 28.993c0 15.986-13.006 28.991-28.993 28.991zm0-41.806c-7.066 0-12.814 5.749-12.814 12.815 0 7.065 5.748 12.812 12.814 12.812s12.815-5.748 12.815-12.812c-.001-7.066-5.749-12.815-12.815-12.815z" /><path
							style="fill:#231f20"
							d="M141.11 141.027a8.2 8.2 0 0 1-1.405-.122c-18.037-3.159-31.129-26.927-31.129-56.514 0-31.888 15.452-56.868 35.177-56.868 17.661 0 31.936 19.495 34.714 47.409a8.09 8.09 0 0 1-7.249 8.85c-4.455.454-8.408-2.803-8.85-7.249-2.018-20.279-11.234-32.831-18.615-32.831-8.968 0-18.998 17.401-18.998 40.689 0 22.415 9.174 39.078 17.742 40.578a8.09 8.09 0 0 1-1.387 16.058zM64.591 159.25c-15.987 0-28.992-13.005-28.992-28.991 0-15.987 13.005-28.993 28.992-28.993s28.993 13.007 28.993 28.993c0 15.986-13.007 28.991-28.993 28.991zm0-41.806c-7.066 0-12.814 5.749-12.814 12.815 0 7.065 5.748 12.812 12.814 12.812s12.815-5.748 12.815-12.812c-.001-7.066-5.75-12.815-12.815-12.815z"
						/><path
							style="fill:#231f20"
							d="M75.729 141.027c-.464 0-.932-.04-1.404-.122-18.038-3.159-31.129-26.927-31.129-56.514 0-31.888 15.452-56.868 35.177-56.868 17.663 0 31.937 19.495 34.714 47.409a8.09 8.09 0 0 1-7.25 8.85c-4.456.454-8.409-2.804-8.851-7.249-2.016-20.281-11.231-32.832-18.613-32.832-8.968 0-18.998 17.401-18.998 40.689 0 22.415 9.173 39.078 17.739 40.578a8.091 8.091 0 0 1-1.385 16.059zM489.056 440.616h-37.343a8.088 8.088 0 0 1-8.089-8.089V92.42a8.09 8.09 0 0 1 16.073-1.297l51.924 319.732c.01.061.019.123.027.184.588 4.24 1.249 14.913-5.31 22.445-2.832 3.253-8.13 7.132-17.282 7.132zm-29.253-16.179h29.253c3.709 0 4.741-1.186 5.081-1.577 1.665-1.912 1.952-6.139 1.497-9.513l-35.831-220.649v231.739zM252.758 152.976h-56.98c-11.598 0-21.032-9.435-21.032-21.032v-3.373c0-11.597 9.434-21.032 21.032-21.032h56.98c11.597 0 21.032 9.435 21.032 21.032v3.373c.001 11.597-9.435 21.032-21.032 21.032zm-56.98-29.258a4.86 4.86 0 0 0-4.854 4.854v3.373a4.86 4.86 0 0 0 4.854 4.854h56.98a4.86 4.86 0 0 0 4.854-4.854v-3.373a4.86 4.86 0 0 0-4.854-4.854h-56.98zM376.991 242.697H178.968a8.088 8.088 0 0 1-8.089-8.089 8.088 8.088 0 0 1 8.089-8.089h198.024a8.089 8.089 0 1 1-.001 16.178zM152.084 242.697H71.545a8.089 8.089 0 1 1 0-16.178h80.539a8.09 8.09 0 0 1 0 16.178zM376.991 289.075H71.545a8.089 8.089 0 1 1 0-16.178h305.446a8.09 8.09 0 0 1 0 16.178zM376.991 335.454H71.545a8.089 8.089 0 1 1 0-16.178h305.446a8.09 8.09 0 0 1 0 16.178zM376.991 381.833H71.545a8.089 8.089 0 1 1 0-16.178h305.446a8.09 8.09 0 0 1 0 16.178zM269.569 428.212H71.545a8.089 8.089 0 1 1 0-16.178h198.024a8.089 8.089 0 1 1 0 16.178zM376.991 428.212h-80.539a8.088 8.088 0 0 1-8.089-8.089 8.089 8.089 0 0 1 8.089-8.089h80.539a8.09 8.09 0 0 1 0 16.178z"
						/></svg
					>
				</div>
			</div>
		</div>
		<div class="mt-5 flex items-center">
			{#if team}
				<!-- this is wrong it should be Team.registered -->
				<button class="rounded-xl bg-gray-500 px-5 py-3 text-2xl text-white max-sm:text-xl max-lg:mx-auto" disabled> Registered </button>
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
				<div class="text-center text-xl max-sm:text-lg flex justify-center border border-white my-2 py-2">
					<img src={member.image} alt="profile-img" class="h-10 w-10 mx-2 my-auto rounded-full">
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
							<button class="mx-2 rounded-md bg-red-600 p-1 text-sm w-fit h-fit my-auto" on:click={() => deleteTeamMember(member.id)}>Remove</button>
						{:else if member.id != userId}
							<button class="mx-2 rounded-md bg-red-600 p-1 text-sm w-fit h-fit my-auto" on:click={() => deleteTeamMember(member.id)}>Leave</button>
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
</style>
