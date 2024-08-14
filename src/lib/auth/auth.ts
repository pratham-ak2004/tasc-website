import { DefaultSession, SvelteKitAuth, SvelteKitAuthConfig } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from '@auth/sveltekit/providers/google';
import { db } from '$lib/db/db';
import { env } from '$lib/env';

const authOptions: SvelteKitAuthConfig = {
	adapter: PrismaAdapter(db),
	providers: [
		Google({
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,

			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	callbacks: {
		async session({ session, user, token }) {
			const sess = {} as DefaultSession;

			sess.expires = session.expires;
			sess.user = user;

			return sess;
		}
	}
};

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);
