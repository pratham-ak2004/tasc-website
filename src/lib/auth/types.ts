type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: any;
	image: string;

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
	name: string;
	email: string;
	image: string;
};

type UserProfile = {
	id: string;

	bio: string | null;
	phone: number | null;
	username: string | null;
	usn: string | null;
	lightTheme: string | null;
	darkTheme: string | null;
};

export { 
    type User, 
    type UserData, 
    type UserProfile 
};
