<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { downloadData } from '../../utils.js';
	import { Download } from 'lucide-svelte';
	import { page } from '$app/stores';
	import * as Dialog from '$lib/components/ui/dialog';
	import { user } from '$lib/auth/stores.js';

	export let data;

	let show = 'participants';

	const participants = data.adminData.participants?.participants ?? [];
	const winners = data.adminData.participants?.winners ?? [];

	const participantsColumns = Object.keys(participants[0]);
	const winnersColumns = Object.keys(winners?.length > 0 ? winners[0] : []);

	console.log(participants);
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
				{#each participantsColumns as column}
					<Table.Head>{column}</Table.Head>
				{/each}
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
												<!-- <Table.Body>
													{#each item as userItem}
														<Table.Cell>{userItem.displayName}</Table.Cell>
														<Table.Cell>{userItem.email}</Table.Cell>
														<Table.Cell>{userItem.username}</Table.Cell>
														<Table.Cell>{userItem.phone}</Table.Cell>
													{/each}
												</Table.Body> -->
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
