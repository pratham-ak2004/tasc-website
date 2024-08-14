import { writable, derived } from 'svelte/store';
import { type User, type UserData, type UserProfile } from './types';

function setUser(data: { session: any }) {
	if (data.session === null) {
		user.set(null);
	} else {
		user.set(data.session.user);
	}
}

const user = writable<User | null>(null);

const userLoaded = writable(false);

const userData = derived(user, ($user, set) => {
	if ($user === null) {
		set(null);
	} else {
		const data: UserData = {
			id: $user.id,
			name: $user.name,
			email: $user.email,
			image: $user.image
		};

        set(data);
	}
    userLoaded.set(true);
});

const userProfile = derived(user, ($user, set) => {

    if($user === null) {
        set(null);
    } else {
        const data: UserProfile = {
            id: $user.id,
            bio: $user.bio,
            phone: $user.phone,
            username: $user.username,
            usn: $user.usn,
            lightTheme: $user.lightTheme,
            darkTheme: $user.darkTheme
        }
        set(data)
    }
});

export { user, userData, userProfile, setUser };
