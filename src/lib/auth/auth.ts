import { DefaultSession, SvelteKitAuth, SvelteKitAuthConfig } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from '@auth/sveltekit/providers/google';
import { db } from '$lib/db/db';

const authOptions:SvelteKitAuthConfig = {
	adapter: PrismaAdapter(db),
	providers: [Google],
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
