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
                    team: userInfo.team,
                    teamName: userInfo.teamName,
                    teamId: userInfo.teamId,
                    maxTeamSize: data.event.maxTeamSize
                })
            });

            const res = await response.json();
            if (res.created) {
                success('Team created successfully');
                teamDetails = { name: userInfo.teamName, id: res.team.id };
            } else if (res.joined) {
                success(`Joined team ${res.team.name} successfully`);
                setTimeout(() => {
                    res.userCreate && user.set({ ...$user, displayName: userInfo.name, phone: userInfo.phone, usn: userInfo.usn });
                    goto('/events/upcoming')
                }, 3000);
            } else if (res.success) {
                success(`Registered for ${data.event.title} successfully`);
                setTimeout(() => {
                    res.userCreate && user.set({ ...$user, displayName: userInfo.name, phone: userInfo.phone, usn: userInfo.usn });
                    goto('/events/upcoming')
                }, 3000);
            } else {
                exclaim(res.error)
                failure('Failed to register for the event');
                setTimeout(() => {
                    res.userCreate && user.set({ ...$user, displayName: userInfo.name, phone: userInfo.phone, usn: userInfo.usn });
                    goto('/events/upcoming')
                }, 3000);
            }
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
            <Input type="text" name="name" placeholder="Name..." bind:value={userInfo.name} />
        {/if}
        
        <Label for="phone">Phone number</Label>
        {#if $userProfileData?.phone}
            <p class="text-white bg-muted px-3 py-2 text-sm rounded-md">{$userProfileData?.phone}</p>
        {:else}
            <Input type="text" name="phone" placeholder="Phone Number..." bind:value={userInfo.phone} />
        {/if}
        
        <Label for="usn">USN</Label>
        {#if $userProfileData?.usn}
            <p class="text-white bg-muted px-3 py-2 text-sm rounded-md">{$userProfileData.usn}</p>
        {:else}
            <Input type="text" name="usn" placeholder="USN..." bind:value={userInfo.usn} />
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
                <Input type="text" name="teamName" placeholder="Team Name..." bind:value={userInfo.teamName} />
            {:else if userInfo.team === 'join'}
                <label for="teamId">Team ID</label>
                <Input type="text" name="teamId" placeholder="Team ID..." bind:value={userInfo.teamId} />
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
