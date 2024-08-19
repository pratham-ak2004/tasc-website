type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: any;
	image: string;

	displayName: string | null;
	bio: string | null;
	phone: number | null;
	username: string | null;
	usn: string | null;

	lightTheme: string | null;
	darkTheme: string | null;

	createdAt: string;
	updatedAt: string;
};

type UserData = {
	id: string;
	displayName: string;
	username: string;
	usn: string | null;
};

type UserProfileData = {
	id: string;

	photoURL: string|null;
	bio: string | null;
	phone: number | null;
	usn: string | null;
	lightTheme: string | null;
	darkTheme: string | null;
};

export { 
    type User, 
    type UserData, 
    type UserProfileData
};
