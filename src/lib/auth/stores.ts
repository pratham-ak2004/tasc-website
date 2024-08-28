import { writable, derived, type Readable } from 'svelte/store';
import { type User, type UserData, type UserProfileData } from './types';

let links: any = null;

function setUser(data: { session: any, links: any }) {
	if (data.session === null) {
		user.set(null);
	} else {
		links = data.links;
		user.set(data.session.user);
	}
}

const user = writable<User | null>(null);

const userLoaded = writable(false);

const userData:Readable<UserData | null> = derived(user, ($user, set) => {

	if ($user === null || $user.username === null) {
		set(null);
	} else {
		const data: UserData = {
			id: $user.id,
			displayName: $user.displayName || '',
			username: $user.username || '',
			usn: $user.usn || null
		};
		set(data);
	}
	userLoaded.set(true);
});

const userProfileData:Readable<UserProfileData | null> = derived(user, ($user, set) => {
	if ($user === null) {
		set(null);
	} else {
		const data: UserProfileData = {
            photoURL: $user.image,
			id: $user.id,
			bio: $user.bio,
			phone: $user.phone,
			usn: $user.usn,
			college: $user.college,
			instagram: links?.instagram,
			linkedin: links?.linkedin,
			github: links?.github,
			twitter: links?.twitter,
			custom1: links?.custom1,
			custom2: links?.custom2,
			custom3: links?.custom3,
			custom4: links?.custom4,
			order: links?.order || [],
			lightTheme: $user.lightTheme,
			darkTheme: $user.darkTheme
		};
		set(data);
	}
});

export { user, userData, userProfileData, userLoaded, setUser };
