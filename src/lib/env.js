import { dev } from "$app/environment"

// export const env = {
// 	DATABASE_URL: process.env.DATABASE_URL,
// 	HOST_STATUS: process.env.HOST_STATUS || dev ? "development" : "production",
// 	AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
// 	AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET
// };

export const env = {
	DATABASE_URL: import.meta.env.DATABASE_URL,
	HOST_STATUS: import.meta.env.HOST_STATUS || dev ? 'development' : 'production',
	AUTH_GOOGLE_ID: import.meta.env.AUTH_GOOGLE_ID,
	AUTH_GOOGLE_SECRET: import.meta.env.AUTH_GOOGLE_SECRET
};
