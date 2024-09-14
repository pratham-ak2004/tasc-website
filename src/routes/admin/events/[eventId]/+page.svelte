<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { downloadData } from '../../utils.js';
	import { Download } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { success, failure, exclaim, information } from '$lib/components/Toast/toast.js';

	export let data;

	let show = 'participants';

	let participants: any[] = [];
	let winners: any[] = [];
	let participantsColumns: string[] = [];
	let winnersColumns: string[] = [];

	$: {
		if (data.adminData) {
			participants = data.adminData.participants ?? [];
			winners = data.adminData.winnersData ?? [];
			if (participants.length > 0) {
				participantsColumns = Object.keys(participants[0]);
			} else {
				participantsColumns = [];
			}
			if (winners.length > 0) {
				winnersColumns = Object.keys(winners[0]);
			} else {
				winnersColumns = [];
			}
		}
	}

	function addWinners(teamId: string) {
		const eventId = $page.url.pathname.split('/').filter(Boolean).pop();
	}

	function setAttendedState(state: boolean, participantId: string) {
		axios.post('/api/admin/events/attendence', {
			state: state,
			teamId: participantId
		}).then((res) => {
			if(res.status === 200){
				success('Attendence state updated');
				participants = participants.map((participant) => {
					if(participant.id === participantId){
						participant.attended = state;
					}
					return participant;
				});
			}else{
				exclaim("Couldn't update attendence state");
			}
		}).catch((err) => {
			failure('Failed to update attendence state');
		});
	}
</script>

<div class="flex flex-row justify-between gap-4">
	<div class="flex flex-row gap-2">
		<button
			class="mt-4 flex flex-row flex-nowrap items-center gap-2 rounded-md border-2 bg-slate-300 p-2 dark:bg-slate-800"
			on:click={() => {
				// eslint-disable-next-line no-undef
				if (participants) {
					downloadData(participants, participantsColumns, 'paticipants');
				}
			}}><Download />Download participants</button
		>
		<button
			class="mt-4 flex flex-row flex-nowrap items-center gap-2 rounded-md border-2 bg-slate-300 p-2 dark:bg-slate-800"
			on:click={() => {
				// eslint-disable-next-line no-undef
				if (participants) {
					downloadData(winners, winnersColumns, 'winners');
				}
			}}><Download />Download winners</button
		>
	</div>
	<div class="flex flex-row gap-2">
		<Button
			class="mt-4"
			on:click={() => {
				show = 'participants';
			}}>Participants {participants.length}</Button
		>
		<Button
			class="mt-4"
			on:click={() => {
				show = 'winners';
			}}>winners {winners.length}</Button
		>
	</div>
</div>

<div class="h-[80vh] overflow-auto">
	<h1 class="w-full text-center text-3xl font-bold">
		{#if show === 'participants'}
			Participants
		{:else}
			Winners
		{/if}
	</h1>
	<Table.Root>
		<Table.Caption
			>List of all
			{#if show === 'participants'}
				Participants
			{:else}
				Winners
			{/if}</Table.Caption
		>
		<Table.Header>
			<Table.Row>
				{#if show === 'participants'}
					{#each participantsColumns as column}
						<Table.Head>{column}</Table.Head>
					{/each}
				{:else}
					{#each winnersColumns as column}
						<Table.Head>{column}</Table.Head>
					{/each}
				{/if}
			</Table.Row>
		</Table.Header>
		<Table.Body class="h-1/2 overflow-auto">
			{#if show === 'participants'}
				{@const columns = participantsColumns}
				{@const data = participants}
				{#each data as item}
					<Table.Row>
						{#each columns as column}
							{#if column === 'user'}
								<Table.Cell>
									<Dialog.Root>
										<Dialog.Trigger><Button>User</Button></Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>Team Members</Dialog.Title>
											</Dialog.Header>
											<Table.Root>
												<Table.Header>
													<Table.Head>DisplayName</Table.Head>
													<Table.Head>Email</Table.Head>
													<Table.Head>UserName</Table.Head>
													<Table.Head>Phone</Table.Head>
												</Table.Header>
												<Table.Body>
													{#each item[column] as userItem}
														<Table.Row>
															<Table.Cell class="text-nowrap">{userItem.displayName}</Table.Cell>
															<Table.Cell>{userItem.email}</Table.Cell>
															<Table.Cell>{userItem.username}</Table.Cell>
															<Table.Cell>{userItem.phone}</Table.Cell>
														</Table.Row>
													{/each}
												</Table.Body>
											</Table.Root>
										</Dialog.Content>
									</Dialog.Root>
								</Table.Cell>
							{:else if column === 'attended'}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Table.Cell><Button>{item[column]}</Button></Table.Cell>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Label>Select State</DropdownMenu.Label>
											<DropdownMenu.Separator />
											<DropdownMenu.Item on:click={() => setAttendedState(true, item['id'])}>True</DropdownMenu.Item>
											<DropdownMenu.Item on:click={() => setAttendedState(false, item['id'])}>False</DropdownMenu.Item>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{:else}
								<Table.Cell>{item[column]}</Table.Cell>
							{/if}
						{/each}
					</Table.Row>
				{/each}
			{:else}
				{@const columns = winnersColumns}
				{@const data = winners}
				{#each data as item}
					<Table.Row>
						{#each columns as column}
							{#if column === 'user'}
								<Table.Cell>
									<Dialog.Root>
										<Dialog.Trigger><Button>User</Button></Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>Team Members</Dialog.Title>
											</Dialog.Header>
											<Table.Root>
												<Table.Header>
													<Table.Head>DisplayName</Table.Head>
													<Table.Head>Email</Table.Head>
													<Table.Head>UserName</Table.Head>
													<Table.Head>Phone</Table.Head>
												</Table.Header>
											</Table.Root>
										</Dialog.Content>
									</Dialog.Root>
								</Table.Cell>
							{:else}
								<Table.Cell>{item[column]}</Table.Cell>
							{/if}
						{/each}
					</Table.Row>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
