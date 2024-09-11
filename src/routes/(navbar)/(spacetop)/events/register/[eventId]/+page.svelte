<script lang="ts">
    import { signIn } from "@auth/sveltekit/client";
    import { setUser, user, userProfileData } from "$lib/auth/stores";
    import { exclaim, failure, success } from "$lib/components/Toast/toast";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    export let data: any;

    let userInfo: { name: string | null; phone: string | null; usn: string | null; team: string | null; teamName: string | null; teamId: string | null } = { name: null, phone: null, usn: null, team: null, teamName: null, teamId: null };
    let teamDetails: { name: string, id: string } | null = null;
    let disabled: boolean = true;

    const reName = /(^[a-zA-Z][a-zA-Z\s]{0,48}[a-zA-Z]$)/;
	const reUSN = /^[A-Z0-9]*$/;
	const rePhone = /^[0-9]{10}$/;
    const reCUID = /^c[a-z0-9]{24}$/;

	$: isValidPhone = userInfo.phone && userInfo.phone?.length === 10 && rePhone.test(userInfo.phone);
	$: isTouchedPhone = userInfo.phone && userInfo.phone.length >= 1;

	$: isValidName = userInfo.name && userInfo.name?.length > 4 && userInfo.name.length < 48 && reName.test(userInfo.name);
	$: isTouchedName = userInfo.name && userInfo.name.length >= 1;

    $: isValidTeamName = userInfo.teamName && userInfo.teamName?.length > 4 && userInfo.teamName.length < 48 && reName.test(userInfo.teamName);
	$: isTouchedTeamName = userInfo.teamName && userInfo.teamName.length >= 1;

	$: isValidUSN = userInfo.usn && userInfo.usn?.length > 1 && userInfo.usn.length < 15 && reUSN.test(userInfo.usn);
	$: isTouchedUSN = userInfo.usn && userInfo.usn.length >= 1;

    $: isValidTeamId = userInfo.teamId && reCUID.test(userInfo.teamId);
    $: isTouchedTeamId = userInfo.teamId && userInfo.teamId.length >= 1;

    onMount(async () => {
        if (!$user) {
            await signIn('google')
            setUser({ session: data.session, links: data.links })
        }else {
            userInfo = { name: $user.displayName, phone: $user.phone, usn: $user.usn, team: '', teamName: '', teamId: '' };
        }
        checkRegistration();
    });

    const checkRegistration = async () => {
        if ($user) {
            const response = await fetch(`/api/eventRegistration?eventId=${data.event.id}&studentId=${$user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res = await response.json();
            if (res.isExists) {
                exclaim('You have already registered for the event');
                setTimeout(() => goto('/events/upcoming'), 3000);
            }
        }
    };

    const registerForEvent = async () => {
        if ($user) {
            const response = await fetch('/api/eventRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: data.event.id,
                    userCreate: ($user.displayName && $user.phone && $user.usn) ? false : true,
                    userId: $user.id,
                    userName: userInfo.name,
                    userPhone: userInfo.phone,
                    userUsn: userInfo.usn,
                    userUsername: $user.email.split('@')[0],
                    team: userInfo.team,
                    teamName: userInfo.teamName,
                    teamId: userInfo.teamId,
                    maxTeamSize: data.event.maxTeamSize
                })
            });

            const res = await response.json();
            if (res.created) {
                success('Team created successfully');
                if(userInfo.teamName) teamDetails = { name: userInfo.teamName, id: res.team.id };
            } else if (res.joined) {
                success(`Joined team ${res.team.name} successfully`);
                setTimeout(() => {
                    goto('/events/upcoming')
                }, 3000);
            } else if (res.success) {
                success(`Registered for ${data.event.title} successfully`);
                setTimeout(() => {
                    goto('/events/upcoming')
                }, 3000);
            } else {
                exclaim(res.error)
                failure('Failed to register for the event');
                setTimeout(() => {
                    goto('/events/upcoming')
                }, 3000);
            }

            if(res.userCreate) setTimeout(() => (user.set({ ...$user, displayName: userInfo.name, phone: userInfo.phone, usn: userInfo.usn, username: $user.email.split('@')[0] })), 3000);
        }
    };

    // Clipboard action
    const copyToClipboard = () => {
        if (teamDetails) {
            navigator.clipboard.writeText(teamDetails.id)
                .then(() => {
                    exclaim('Team ID copied to clipboard');
                    goto('/events/upcoming');
                })
                .catch(() => {
                    failure('Failed to copy Team ID to clipboard');
                });
        }
    };

    // Reactive block to handle disabling button logic
    $: disabled = !(userInfo.name && userInfo.phone && userInfo.usn) || 
    (data.event.type === 'TEAM' && 
        ((userInfo.team === 'create' && !userInfo.teamName) || 
        (userInfo.team === 'join' && !userInfo.teamId) || 
        !userInfo.team)
    );
</script>

<!-- HTML template -->
<div>
    <h1>{data.event.title}</h1>
    <div class="flex flex-col">
        <Label for="name">Name</Label>
        {#if $userProfileData?.displayName}
            <p class="text-white bg-muted px-3 py-2 text-sm rounded-md">{$userProfileData?.displayName}</p>
        {:else}
            <Input type="text" name="name" placeholder="Name..." bind:value={userInfo.name} class={!isValidName && isTouchedName ? 'bg-red-200 dark:bg-red-900' : ''} required />
            {#if isTouchedName && !isValidName}
				<div>
					<p>The name you have entered is invalid.</p>
					<p class="text-sm text-muted-foreground">Your name must begin with a Capital letter and shouldn't begin or end with a space.</p>
				</div>
			{/if}
        {/if}
        
        <Label for="phone">Phone number</Label>
        {#if $userProfileData?.phone}
            <p class="text-white bg-muted px-3 py-2 text-sm rounded-md">{$userProfileData?.phone}</p>
        {:else}
            <Input type="text" name="phone" placeholder="Phone Number..." bind:value={userInfo.phone} class="{!isValidPhone && isTouchedPhone ? 'bg-red-200 dark:bg-red-900' : ''}" required />
            {#if isTouchedPhone && !isValidPhone}
				<div>
					<p>Write your number as 10 digits with no other characters</p>
				</div>
			{/if}
        {/if}
        
        <Label for="usn">USN</Label>
        {#if $userProfileData?.usn}
            <p class="text-white bg-muted px-3 py-2 text-sm rounded-md">{$userProfileData.usn}</p>
        {:else}
            <Input type="text" name="usn" placeholder="USN..." bind:value={userInfo.usn} class={!isValidUSN && isTouchedUSN ? 'bg-red-200 dark:bg-red-900' : ''} required />
            {#if isTouchedUSN && !isValidUSN}
				<div class="mb-2">
					<p>USN should contain only numbers and CAPITAL letters.</p>
					<p class="text-sm text-muted-foreground">USN must be 2-14 characters long and alphanumeric (CAPITAL letters only)</p>
				</div>
			{/if}
        {/if}

        {#if data.event.type === 'TEAM'}
            <label for="team">Create or join a team</label>
            <select name="team" bind:value={userInfo.team} class="text-black">
                <option value="" disabled>Choose an option</option>
                <option value="create">Create Team</option>
                <option value="join">Join Team</option>
            </select>

            {#if userInfo.team === 'create'}
                <label for="teamName">Team Name</label>
                <Input type="text" name="teamName" placeholder="Team Name..." bind:value={userInfo.teamName}  class={!isValidTeamName && isTouchedTeamName ? 'bg-red-200 dark:bg-red-900' : ''} required />
                {#if isTouchedTeamName && !isValidTeamName}
                    <div>
                        <p>The team name you have entered is invalid.</p>
                        <p class="text-sm text-muted-foreground">Your team name must begin with a Capital letter and shouldn't begin or end with a space.</p>
                    </div>
                {/if}
            {:else if userInfo.team === 'join'}
                <label for="teamId">Team ID</label>
                <Input type="text" name="teamId" placeholder="Team ID..." bind:value={userInfo.teamId} class="{!isValidTeamId && isTouchedTeamId ? 'bg-red-200 dark:bg-red-900' : ''}" required />
                {#if isTouchedTeamId && !isValidTeamId}
                    <div class="mb-2">
                        <p>Team ID should start with a lowercase 'c' and contain only lowercase letters and numbers.</p>
                        <p class="text-sm text-muted-foreground">Team ID must be exactly 25 characters long, starting with 'c'.</p>
                    </div>
                {/if}
            {/if}

            {#if teamDetails}
                <p>Team Name: {teamDetails.name}</p>
                <div class="flex">
                    <p>Team ID: </p>
                    <input type="text" value={teamDetails.id} readonly>
                    <button on:click={copyToClipboard}>Copy</button>
                </div>
            {/if}
        {/if}
        
        <button on:click={registerForEvent} disabled={disabled}>Register</button>
    </div>
</div>
