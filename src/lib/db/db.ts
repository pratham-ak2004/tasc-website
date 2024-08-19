import { PrismaClient } from '@prisma/client';
import { env } from '$lib/env';

const createPrismaClient = () =>
	new PrismaClient({
		log: env.HOST_STATUS === 'development' ? ['query', 'error', 'warn'] : ['error']
	});

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.HOST_STATUS !== 'production') globalForPrisma.prisma = db;